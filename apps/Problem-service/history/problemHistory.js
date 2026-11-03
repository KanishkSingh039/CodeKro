const { randomUUID } = require("crypto");
const { problem } = require("@codekro/db_config");
const { client } = require("@codekro/redis-config");
const logger = require("@codekro/logger");

const HISTORY_LIMIT = 100;
const PROMPT_HISTORY_LIMIT = 50;
const PROMPT_DESCRIPTION_CHARS = 200;
const HISTORY_TTL_SECONDS = 30 * 24 * 60 * 60;
const LOCK_TTL_MS = 10_000;
const LOCK_WAIT_ATTEMPTS = 5;
const LOCK_WAIT_MS = 100;

const historyKey = (userId) => `problem:${userId}`;
const historyLockKey = (userId) => `problem-history-lock:${userId}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toPlain = (document) =>
    document && typeof document.toObject === "function" ? document.toObject() : document;

const readCachedHistory = async (userId) => {
    const items = await client.lRange(historyKey(userId), 0, -1);
    if (items.length === 0) return null;

    try {
        return items.map((item) => JSON.parse(item));
    } catch (error) {
        logger.warn(`Discarding invalid problem history cache: ${error.message}`);
        await client.del(historyKey(userId)).catch(() => undefined);
        return null;
    }
};

const writeCachedHistory = async (userId, problemsOldestFirst) => {
    const key = historyKey(userId);
    const transaction = client.multi();
    transaction.del(key);

    if (problemsOldestFirst.length > 0) {
        transaction.rPush(key, ...problemsOldestFirst.map((item) => JSON.stringify(toPlain(item))));
        transaction.lTrim(key, -HISTORY_LIMIT, -1);
        transaction.expire(key, HISTORY_TTL_SECONDS);
    }

    await transaction.exec();
};

const clearCachedHistory = (userId) => client.del(historyKey(userId));

const findHistoryInDb = async (userId, limit = HISTORY_LIMIT) =>
    problem
        .find({ user_id: userId })
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit)
        .lean();

const findPromptHistoryInDb = async (userId) =>
    problem.aggregate([
        { $match: { user_id: userId } },
        { $sort: { createdAt: -1, _id: -1 } },
        { $limit: PROMPT_HISTORY_LIMIT },
        {
            $project: {
                _id: 0,
                title: 1,
                description: { $substrCP: ["$description", 0, PROMPT_DESCRIPTION_CHARS] },
                difficulty: 1,
            },
        },
    ]);

const acquireLock = async (userId) => {
    const token = randomUUID();
    const result = await client.set(historyLockKey(userId), token, {
        expiration: { type: "PX", value: LOCK_TTL_MS },
        condition: "NX",
    });
    return result === "OK" ? token : null;
};

const waitForLock = async (userId) => {
    for (let attempt = 0; attempt < LOCK_WAIT_ATTEMPTS; attempt += 1) {
        const token = await acquireLock(userId);
        if (token) return token;
        await sleep(LOCK_WAIT_MS);
    }
    return null;
};

const releaseLock = async (userId, token) => {
    await client.eval(
        'if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) else return 0 end',
        {
            keys: [historyLockKey(userId)],
            arguments: [token],
        }
    );
};

const rebuildCachedHistory = async (userId) => {
    let token = null;

    try {
        token = await waitForLock(userId);
        if (!token) return null;

        const cached = await readCachedHistory(userId);
        if (cached) return cached.slice().reverse();

        const problems = await findHistoryInDb(userId);
        await writeCachedHistory(userId, problems.slice().reverse());
        return problems;
    } catch (error) {
        logger.warn(`Failed to rebuild problem history cache: ${error.message}`);
        await clearCachedHistory(userId).catch(() => undefined);
        return null;
    } finally {
        if (token) {
            await releaseLock(userId, token).catch(() => undefined);
        }
    }
};

const getProblemHistory = async (userId) => {
    try {
        const cached = await readCachedHistory(userId);
        if (cached) return cached.slice().reverse();
    } catch (error) {
        logger.warn(`Problem history cache read failed: ${error.message}`);
        return findHistoryInDb(userId);
    }

    const rebuilt = await rebuildCachedHistory(userId);
    if (rebuilt) return rebuilt;

    return findHistoryInDb(userId);
};

const getProblemsForPrompt = (userId) => findPromptHistoryInDb(userId);

const refreshProblemHistory = async (userId) => {
    let token = null;

    try {
        token = await waitForLock(userId);
        if (!token) {
            await clearCachedHistory(userId);
            return;
        }

        const problems = await findHistoryInDb(userId);
        await writeCachedHistory(userId, problems.slice().reverse());
    } catch (error) {
        logger.warn(`Failed to refresh problem history cache: ${error.message}`);
        await clearCachedHistory(userId).catch(() => undefined);
    } finally {
        if (token) {
            await releaseLock(userId, token).catch(() => undefined);
        }
    }
};

module.exports = {
    getProblemHistory,
    getProblemsForPrompt,
    refreshProblemHistory,
    HISTORY_LIMIT,
};

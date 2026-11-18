const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('@codekro/logger');
const { client } = require('@codekro/redis-config');
const { setAuthCookie, clearAuthCookie } = require('@codekro/authentication-middleware');
const CodeKroUser = require('../schema/register');
const { problem: Problem, Solution } = require('@codekro/db_config');

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVATAR_DATA_PATTERN = /^data:image\/(jpeg|png|webp);base64,/;

const safeTokenPicture = (value) => {
  const picture = String(value || '');
  return picture.startsWith('data:') ? '' : picture;
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeUsername = (value) => String(value || '').trim().toLowerCase();

const normalizeOtp = (value) => {
  if (value === null || value === undefined) return '';
  try {
    const parsed = JSON.parse(value);
    if (parsed !== null && typeof parsed !== 'object') return String(parsed);
  } catch (error) {
    // Plain values are stored directly.
  }
  return String(value);
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const languageLabel = (language) => {
  switch (language) {
    case 'cpp':
      return 'C++';
    case 'py':
      return 'Python3';
    case 'java':
      return 'Java';
    default:
      return language || '—';
  }
};

const getActivityLevel = (count) => {
  if (count >= 5) return 4;
  if (count >= 3) return 3;
  if (count >= 2) return 2;
  return count > 0 ? 1 : 0;
};

const dateKey = (date) => date.toISOString().slice(0, 10);

const findUserByUsername = (username) => {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;

  return CodeKroUser.findOne({
    username: { $regex: `^${escapeRegex(normalized)}$`, $options: 'i' },
  });
};

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
      picture: safeTokenPicture(user.picture),
      googlelogin: false,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

const refreshSession = async (res, user) => {
  const token = signToken(user);
  setAuthCookie(res, token);

  try {
    await client.set(
      `${user.email}`,
      JSON.stringify({ user: user.username, email: user.email, token })
    );
  } catch (error) {
    logger.error(`Failed to refresh cached session: ${error.message}`);
  }

  return token;
};

const buildUserStatsFromData = (problems, solutions) => {
  const difficulty = {
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 },
  };

  problems.forEach((item) => {
    const bucket = difficulty[String(item.difficulty || '').toLowerCase()];
    if (!bucket) return;
    bucket.total += 1;
    if (item.submitted) bucket.solved += 1;
  });

  const totalSolved = problems.filter((item) => item.submitted).length;
  const accepted = solutions.filter(
    (item) => String(item.judgement?.verdict || '').toUpperCase() === 'ACCEPTED'
  ).length;
  const totalSubmissions = solutions.length;

  return {
    totalSolved,
    totalProblems: problems.length,
    easy: difficulty.easy,
    medium: difficulty.medium,
    hard: difficulty.hard,
    acceptanceRate: totalSubmissions
      ? Math.round((accepted / totalSubmissions) * 100)
      : 0,
    totalSubmissions,
  };
};

const buildUserStats = async (userId) => {
  const [problems, solutions] = await Promise.all([
    Problem.find({ user_id: String(userId) })
      .select('submitted difficulty topicTags')
      .lean(),
    Solution.find({ user_id: String(userId) })
      .select('language judgement')
      .lean(),
  ]);

  return buildUserStatsFromData(problems, solutions);
};

const buildSkills = (problems) => {
  const counts = new Map();
  problems.forEach((item) => {
    if (!item.submitted) return;
    (item.topicTags || []).forEach((tag) => {
      const key = String(tag);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([topic, count]) => ({ topic, count }));
};

const buildLanguages = (solutions) => {
  const counts = new Map();
  solutions.forEach((item) => {
    const language = languageLabel(item.language);
    if (!language || language === '—') return;
    counts.set(language, (counts.get(language) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([language, count]) => ({ language, count }));
};

const buildProfile = async (target, viewerId) => {
  const [problems, solutions] = await Promise.all([
    Problem.find({ user_id: String(target._id) })
      .select('submitted difficulty topicTags')
      .lean(),
    Solution.find({ user_id: String(target._id) })
      .select('language judgement updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .lean(),
  ]);
  const stats = buildUserStatsFromData(problems, solutions);

  const followerIds = (target.followers || []).map((id) => String(id));
  const isOwner = String(target._id) === String(viewerId);
  const lastActive = solutions[0]?.updatedAt || solutions[0]?.createdAt || target.updatedAt;

  return {
    id: String(target._id),
    username: target.username,
    name: target.name,
    avatarUrl: target.picture || '',
    bio: target.bio || '',
    location: target.location || '',
    organization: target.organization || '',
    website: target.website || '',
    github: target.github || '',
    linkedin: target.linkedin || '',
    email: isOwner ? target.email : '',
    followersCount: followerIds.length,
    followingCount: (target.following || []).length,
    isFollowing: followerIds.includes(String(viewerId)),
    isOwner,
    joinedDate: formatDate(target.createdAt),
    lastActive: formatDate(lastActive),
    skills: buildSkills(problems),
    languages: buildLanguages(solutions),
    stats,
  };
};

const searchUsers = async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) return res.status(200).json({ users: [] });

    const regex = new RegExp(escapeRegex(query), 'i');
    const users = await CodeKroUser.find({
      $or: [{ username: regex }, { name: regex }],
    })
      .select('name username picture followers')
      .limit(20)
      .lean();

    return res.status(200).json({
      users: users.map((user) => ({
        id: String(user._id),
        name: user.name,
        username: user.username,
        avatarUrl: user.picture || '',
        followersCount: (user.followers || []).length,
        isFollowing: (user.followers || []).some(
          (id) => String(id) === String(req.user.id)
        ),
      })),
    });
  } catch (error) {
    logger.error(`Failed to search users: ${error.message}`);
    return res.status(500).json({ message: 'Failed to search users' });
  }
};

const checkUsername = async (req, res) => {
  try {
    const username = normalizeUsername(req.query.username);
    if (!USERNAME_PATTERN.test(username)) {
      return res.status(200).json({ available: false, valid: false, username });
    }

    const existing = await CodeKroUser.exists({ username });
    return res.status(200).json({ available: !existing, valid: true, username });
  } catch (error) {
    logger.error(`Failed to check username: ${error.message}`);
    return res.status(500).json({ message: 'Failed to check username' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const target = await findUserByUsername(req.params.username);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const profile = await buildProfile(target, req.user.id);
    res.set('Cache-Control', 'no-store');
    return res.status(200).json({ user: profile });
  } catch (error) {
    logger.error(`Failed to fetch profile: ${error.message}`);
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const target = await findUserByUsername(req.params.username);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const problems = await Problem.find({
      user_id: String(target._id),
      solvedAt: { $ne: null },
    })
      .select('solvedAt')
      .lean();

    const counts = new Map();
    problems.forEach((item) => {
      if (!item.solvedAt) return;
      const date = new Date(item.solvedAt);
      if (Number.isNaN(date.getTime())) return;
      const key = dateKey(date);
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    const today = new Date();
    const todayUtc = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );
    const requestedYear = Number(req.query.year);
    const currentYear = todayUtc.getUTCFullYear();
    const hasYear = Number.isInteger(requestedYear) && requestedYear >= 2000 && requestedYear <= currentYear + 1;

    const heatmap = [];
    if (hasYear) {
      const start = new Date(Date.UTC(requestedYear, 0, 1));
      const end = new Date(Date.UTC(requestedYear + 1, 0, 1));
      const days = Math.round((end - start) / 86400000);
      for (let index = 0; index < days; index += 1) {
        const date = new Date(start.getTime() + index * 86400000);
        const key = dateKey(date);
        const count = counts.get(key) || 0;
        heatmap.push({ date: key, count, level: getActivityLevel(count) });
      }
    } else {
      for (let offset = 364; offset >= 0; offset -= 1) {
        const date = new Date(todayUtc.getTime() - offset * 86400000);
        const key = dateKey(date);
        const count = counts.get(key) || 0;
        heatmap.push({ date: key, count, level: getActivityLevel(count) });
      }
    }

    let currentStreak = 0;
    for (let offset = 0; offset < 36500; offset += 1) {
      const date = new Date(todayUtc.getTime() - offset * 86400000);
      const key = dateKey(date);
      if (counts.has(key)) {
        currentStreak += 1;
      } else if (offset === 0) {
        continue;
      } else {
        break;
      }
    }

    let longestStreak = 0;
    let streak = 0;
    let previousDay = null;
    Array.from(counts.keys())
      .sort()
      .forEach((key) => {
        const day = Math.floor(Date.parse(`${key}T00:00:00Z`) / 86400000);
        streak = previousDay !== null && day - previousDay === 1 ? streak + 1 : 1;
        longestStreak = Math.max(longestStreak, streak);
        previousDay = day;
      });

    return res.status(200).json({
      currentStreak,
      longestStreak,
      totalActiveDays: counts.size,
      heatmap,
    });
  } catch (error) {
    logger.error(`Failed to fetch activity: ${error.message}`);
    return res.status(500).json({ message: 'Failed to fetch activity' });
  }
};

const getSolvedProblems = async (req, res) => {
  try {
    const target = await findUserByUsername(req.params.username);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const problems = await Problem.find({
      user_id: String(target._id),
      submitted: true,
    })
      .sort({ solvedAt: -1, createdAt: -1 })
      .lean();

    const problemIds = problems.map((item) => String(item._id));
    const solutions = problemIds.length
      ? await Solution.find({
          user_id: String(target._id),
          problem_id: { $in: problemIds },
        })
          .sort({ updatedAt: -1 })
          .lean()
      : [];

    const solutionByProblem = new Map();
    solutions.forEach((solution) => {
      const key = String(solution.problem_id);
      if (!solutionByProblem.has(key)) solutionByProblem.set(key, solution);
    });

    const solved = problems.map((item, index) => {
      const solution = solutionByProblem.get(String(item._id));
      return {
        id: String(item._id),
        frontendQuestionId: index + 1,
        title: item.title,
        titleSlug: slugify(item.title),
        difficulty: String(item.difficulty || 'medium').replace(/^./, (c) => c.toUpperCase()),
        topicTags: item.topicTags || [],
        language: solution ? languageLabel(solution.language) : '—',
        firstSolvedDate: formatDate(item.solvedAt),
        solvedAt: item.solvedAt,
      };
    });

    return res.status(200).json({ solved });
  } catch (error) {
    logger.error(`Failed to fetch solved problems: ${error.message}`);
    return res.status(500).json({ message: 'Failed to fetch solved problems' });
  }
};

const getSolvedSolution = async (req, res) => {
  try {
    const target = await findUserByUsername(req.params.username);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const problem = await Problem.findOne({
      _id: req.params.problemId,
      user_id: String(target._id),
      submitted: true,
    }).lean();

    if (!problem) return res.status(404).json({ message: 'Solved problem not found' });

    const solution = await Solution.findOne({
      user_id: String(target._id),
      problem_id: String(problem._id),
    })
      .sort({ updatedAt: -1 })
      .lean();

    if (!solution) return res.status(404).json({ message: 'Solution not found' });

    return res.status(200).json({
      solution: {
        ...solution,
        problemTitle: problem.title,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Solved problem not found' });
    }
    logger.error(`Failed to fetch solution: ${error.message}`);
    return res.status(500).json({ message: 'Failed to fetch solution' });
  }
};

const followUser = async (req, res) => {
  try {
    const target = await findUserByUsername(req.params.username);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const viewerId = String(req.user.id);
    if (String(target._id) === viewerId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const following = req.body?.following !== false;
    const operation = following
      ? { $addToSet: { followers: viewerId } }
      : { $pull: { followers: viewerId } };
    const reverseOperation = following
      ? { $addToSet: { following: target._id } }
      : { $pull: { following: target._id } };

    await Promise.all([
      CodeKroUser.updateOne({ _id: target._id }, operation),
      CodeKroUser.updateOne({ _id: viewerId }, reverseOperation),
    ]);

    const updated = await CodeKroUser.findById(target._id)
      .select('followers following')
      .lean();

    return res.status(200).json({
      isFollowing: following,
      followersCount: (updated?.followers || []).length,
      followingCount: (updated?.following || []).length,
    });
  } catch (error) {
    logger.error(`Failed to update follow state: ${error.message}`);
    return res.status(500).json({ message: 'Failed to update follow state' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await CodeKroUser.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const fields = ['name', 'bio', 'location', 'organization', 'website', 'github', 'linkedin'];
    const updates = {};

    fields.forEach((field) => {
      if (req.body?.[field] !== undefined) {
        updates[field] = String(req.body[field] ?? '').trim();
      }
    });

    if (updates.name !== undefined && !updates.name) {
      return res.status(400).json({ message: 'Display name cannot be empty' });
    }
    if (updates.bio !== undefined && updates.bio.length > 160) {
      return res.status(400).json({ message: 'Bio cannot exceed 160 characters' });
    }
    if (updates.name !== undefined && updates.name.length > 100) {
      return res.status(400).json({ message: 'Display name cannot exceed 100 characters' });
    }

    Object.assign(user, updates);
    await user.save();
    await refreshSession(res, user);

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    logger.error(`Failed to update profile: ${error.message}`);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

const updateUsername = async (req, res) => {
  try {
    const username = normalizeUsername(req.body?.username);
    if (!USERNAME_PATTERN.test(username)) {
      return res.status(400).json({
        message: 'Username must be 3-20 characters using lowercase letters, numbers, and underscores',
      });
    }

    const user = await CodeKroUser.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username === user.username) {
      return res.status(200).json({ message: 'Username unchanged', username });
    }

    const existing = await CodeKroUser.findOne({ username, _id: { $ne: user._id } });
    if (existing) return res.status(409).json({ message: 'Username already exists' });

    user.username = username;
    await user.save();
    await refreshSession(res, user);

    return res.status(200).json({ message: 'Username updated successfully', username });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    logger.error(`Failed to update username: ${error.message}`);
    return res.status(500).json({ message: 'Failed to update username' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const user = await CodeKroUser.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const avatarUrl = String(req.body?.avatarUrl ?? '').trim();
    if (avatarUrl) {
      const isDataUrl = AVATAR_DATA_PATTERN.test(avatarUrl);
      const isRemoteUrl = /^https?:\/\//i.test(avatarUrl);
      if (!isDataUrl && !isRemoteUrl) {
        return res.status(400).json({ message: 'Avatar must be a JPG, PNG, WebP, or HTTP URL' });
      }
      if (avatarUrl.length > 3.5 * 1024 * 1024) {
        return res.status(413).json({ message: 'Avatar is too large' });
      }
    }

    user.picture = avatarUrl;
    await user.save();
    await refreshSession(res, user);

    return res.status(200).json({ message: 'Avatar updated successfully' });
  } catch (error) {
    logger.error(`Failed to update avatar: ${error.message}`);
    return res.status(500).json({ message: 'Failed to update avatar' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await CodeKroUser.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.password) {
      return res.status(400).json({ message: 'Password login is not enabled for this account' });
    }

    const matches = await bcrypt.compare(String(currentPassword), user.password);
    if (!matches) return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(String(newPassword), 10);
    await user.save();
    await client.del(`${user.email}`).catch(() => undefined);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    logger.error(`Failed to change password: ${error.message}`);
    return res.status(500).json({ message: 'Failed to change password' });
  }
};


const deleteAccount = async (req, res) => {
  try {
    const confirmation = String(req.body?.confirmation || '').trim().toLowerCase();
    if (confirmation !== 'delete my account') {
      return res.status(400).json({ message: 'Type "delete my account" to confirm' });
    }

    const user = await CodeKroUser.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userId = String(user._id);
    const problems = await Problem.find({ user_id: userId }).select('_id').lean();
    const problemIds = problems.map((problem) => String(problem._id));

    await Promise.all([
      Solution.deleteMany({ user_id: userId }),
      Problem.deleteMany({ user_id: userId }),
      CodeKroUser.updateMany(
        { followers: user._id },
        { $pull: { followers: user._id } }
      ),
      CodeKroUser.updateMany(
        { following: user._id },
        { $pull: { following: user._id } }
      ),
    ]);
    await CodeKroUser.deleteOne({ _id: user._id });

    const cacheKeys = [
      `${user.email}`,
      `otp : ${user.email}`,
      `problem:${userId}`,
      ...problemIds.map((problemId) => `solution:${userId}:${problemId}`),
    ];
    await client.del(cacheKeys).catch(() => undefined);
    clearAuthCookie(res);

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    logger.error(`Failed to delete account: ${error.message}`);
    return res.status(500).json({ message: 'Failed to delete account' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const otp = String(req.body?.otp || '').trim();
    const newPassword = String(req.body?.newPassword || '');

    if (!EMAIL_PATTERN.test(email) || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await CodeKroUser.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid reset request' });

    const otpKey = `otp : ${email}`;
    const storedOtp = await client.get(otpKey);
    if (!storedOtp || normalizeOtp(storedOtp) !== otp) {
      return res.status(400).json({ message: 'OTP is invalid or expired' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await Promise.all([
      client.del(otpKey).catch(() => undefined),
      client.del(`${email}`).catch(() => undefined),
    ]);

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    logger.error(`Failed to reset password: ${error.message}`);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
};

module.exports = {
  searchUsers,
  checkUsername,
  getUserProfile,
  getUserActivity,
  getSolvedProblems,
  getSolvedSolution,
  followUser,
  updateProfile,
  updateUsername,
  updateAvatar,
  changePassword,
  deleteAccount,
  resetPassword,
};

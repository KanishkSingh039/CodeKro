const logger = require("@codekro/logger");

const MAX_SERVICE_CHARS = 2000;
const MAX_HISTORY_ITEMS = 50;
const MAX_DESCRIPTION_ITEMS = 10;
const MAX_HISTORY_CHARS = 6000;
const MAX_TITLE_CHARS = 100;
const MAX_DESCRIPTION_CHARS = 200;

const normalizeText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const truncate = (value, maxLength) => {
    const text = normalizeText(value);
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
};

const formatHistory = (history) => {
    if (!Array.isArray(history) || history.length === 0) {
        return "No previous problems provided.";
    }

    const lines = [];
    let usedCharacters = 0;

    for (const [index, item] of history.slice(0, MAX_HISTORY_ITEMS).entries()) {
        const title = truncate(item?.title, MAX_TITLE_CHARS);
        if (!title) continue;

        const difficulty = normalizeText(item?.difficulty).toLowerCase() || "unknown";
        const description = index < MAX_DESCRIPTION_ITEMS
            ? truncate(item?.description, MAX_DESCRIPTION_CHARS)
            : "";
        const line = `- [${difficulty}] ${title}${description ? ` - ${description}` : ""}`;

        if (usedCharacters + line.length > MAX_HISTORY_CHARS) break;

        lines.push(line);
        usedCharacters += line.length + 1;
    }

    return lines.length > 0 ? lines.join("\n") : "No previous problems provided.";
};

const prompt=(service,history)=>{
    try {
        const normalizedService = truncate(service, MAX_SERVICE_CHARS);
        if(!normalizedService)
        {
            logger.error("Service not provided")
            return "Service not provided";
        }

        const historySummary = Array.isArray(history)
            ? formatHistory(history)
            : truncate(history, MAX_HISTORY_CHARS) || "No previous problems provided.";

            return `
You are an expert DSA problem setter for a coding platform similar to LeetCode.

USER REQUEST:
${normalizedService}

PREVIOUSLY GENERATED PROBLEMS:
${historySummary}

UNIQUENESS REQUIREMENTS:

Generate exactly ONE new programming problem.

Do not repeat any previous problem.

Do not reuse a previous problem with only a different title or wording.

Compare the algorithm, core concept, input structure, and expected solution approach against the history.

Choose a genuinely different problem concept when a similar problem exists in history.

If a requested topic is repeated, create a different problem within that topic.

OUTPUT REQUIREMENTS:
Return ONLY valid JSON. Do not use Markdown or code fences.
Return exactly these fields:

{
"title": "string",
"description": "string",
"test_case": [
{
"input": {},
"output": {}
}
],
"difficulty": "easy",
"topicTags": ["string"],
"companies": ["string"],
"constraints": ["string"],
"hints": ["string"],
"followUp": "string",
"examples": [
{
"input": {},
"output": {},
"explanation": "string"
}
],
"starterCode": {
"cpp": "string",
"java": "string",
"python": "string",
"javascript": "string",
"go": "string"
},
"editorial": [
{
"title": "string",
"description": "string",
"timeComplexity": "string",
"spaceComplexity": "string",
"code": {
"cpp": "string",
"python": "string"
}
}
]
}

Additional rules:

Include at least two meaningful test cases.

Each test case must contain input and output fields.

Use valid JSON types for all values.

Difficulty must be exactly "easy", "medium", or "hard".

Ensure the problem statement, examples, test cases, and expected outputs all agree.

Provide 2 to 5 topicTags and 0 to 5 companies.

Provide 1 to 6 constraints and 1 to 3 hints.

Provide exactly one example for each test_case. Copy that test case's input and output exactly, add a short explanation, and do not invent additional examples.

followUp may be an empty string when no follow-up is needed.

starterCode must contain all five language keys: cpp, java, python, javascript, and go. Each value must be a complete starter function or class using the exact input format of the problem.

editorial must contain at least one approach. Include valid code for cpp and python, with timeComplexity and spaceComplexity.

All code must be plain text inside JSON strings and escaped so the complete response remains valid JSON.

Return exactly one problem, not a list of problems.
`;      
    } catch (error) {
        return error;
    }
} 
module.exports={prompt,formatHistory,MAX_SERVICE_CHARS,MAX_HISTORY_CHARS};

const logger = require("@codekro/logger");
const prompt=(service,history)=>{
    try {
        if(!service)
        {
            logger.error("Service not provided")
            return "Service not provided";
        }
        
            return `
You are an expert DSA problem setter for a coding platform similar to LeetCode.

USER REQUEST:
${service}

PREVIOUSLY GENERATED PROBLEMS:
${history || "No previous problems provided."}

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
"edge_cases": ["string"],
"constraints": ["string"],
"expected_output": "string",
"complexity": {
"time": "string",
"space": "string"
},
"difficulty": "easy"
}

Additional rules:

Include at least two meaningful test cases.

Each test case must contain input and output fields.

Use valid JSON types for all values.

Difficulty must be exactly "easy", "medium", or "hard".

Ensure the problem statement, examples, and expected output agree.

Return exactly one problem, not a list of problems.
`;      
    } catch (error) {
        return error;
    }
} 
module.exports={prompt}; 
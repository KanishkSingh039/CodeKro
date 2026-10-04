const logger = require("@codekro/logger");
const prompt=(service)=>{
    try {
        if(!service)
        {
            logger.error("Service not provided")
            return "Service not provided";
        }
        if(service=="Generate_Problem")
        {
            return `
Generate a programming problem about DSA (Data Structures and Algorithms) with level like leetcode for preperation for interviews.

Return ONLY valid JSON.
Do NOT use Markdown.
Do NOT wrap the JSON inside \`\`\`json.
Do NOT include any text before or after the JSON.

The JSON must have exactly these fields:

{
  "title": "string",
  "description": "string",
  "example_test_cases": [
    {
      "input": {},
      "output": {}
    }
  ],
  "edge_cases": [],
  "constraints": [],
  "expected_output": "string",
  "complexity": {
    "time": "string",
    "space": "string"
  }
}

Requirements:
- "title" must contain the problem title.
- "description" must contain the complete problem statement.
- "example_test_cases" must contain at least 2 examples.
- Each example must contain "input" and "output".
- "edge_cases" must be an array of strings.
- "constraints" must be an array of strings.
- "expected_output" must describe what the program should return.
- "complexity" must contain "time" and "space".
- The output must be valid JSON.
- Use double quotes for all JSON keys and string values.

Generate the problem now.
`;
        }
        if(service=="Judge_result"){
            return "y";
        }
        
    } catch (error) {
        return error;
    }
} 
module.exports={prompt}; 
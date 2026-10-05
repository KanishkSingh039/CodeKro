const logger = require("@codekro/logger");
const fs=require("fs");
const { dockerExecutor } = require("./dockerExecutor");
const execution = async (req, res) => {
    try {
        const { code, language, input } = req.body;
        if (!code || !language || !input)
            return res.status(400).json({ message: "Bad Request" });
        fs.writeFileSync("./temp_wrd/input.txt",input);    
        fs.writeFileSync(`./temp_wrd/main.${language}`,code);
        let languageCommands = {
            "cpp": `g++ main.cpp -o program && ./program < input.txt`,
            "python": `python3 main.py < input.txt`,
            "java": `javac Main.java && java Main < input.txt`,
        };
        const command=languageCommands[language];
        const container=await dockerExecutor(code,language,input,command);
        logger.info("Execution successful", output);
        return res.status(200).json({ message: "Execution successful", output });
    }
    catch(err)
    {
        logger.error("Execution failed", err.message);
        return res.status(500).json({ message: err.message });
    }
}
module.exports={execution}
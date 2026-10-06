const logger = require("@codekro/logger");
const fs=require("fs");
const {PassThrough}=require("stream");
const { dockerExecutor } = require("./dockerExecutor");
const execution = async (req, res) => {
    try {
        const { code, language, input } = req.body;
        if (!code || !language || !input)
            return res.status(400).json({ message: "Bad Request" });
        if (!fs.existsSync("./temp_wrd")) {
            fs.mkdirSync("./temp_wrd", { recursive: true });
        }
        fs.writeFileSync("./temp_wrd/input.txt",input);    
        fs.writeFileSync(`./temp_wrd/main.${language}`,code);
        let languageCommands = {
            "cpp": `g++ main.cpp -o program && ./program < input.txt`,
            "python": `python3 main.py < input.txt`,
            "java": `javac Main.java && java Main < input.txt`,
        };
        const command=languageCommands[language];
        const container=await dockerExecutor(code,language,input,command);
        await container.start();
        const log=await container.logs({
            stdout:true,
            stderr:true,
            follow:true
        });
        let output="";
        let error="";
        const stdout=new PassThrough();
        const stderr=new PassThrough();
        stdout.on("data",(data)=>{
            output+=data.toString();
        })
        stderr.on("data",(data)=>{
            error+=data.toString();
        })
        container.modem.demuxStream(
            log,
            stdout,
            stderr
        );
        await container.wait();
        await container.remove({
            force: true
        });
        logger.info("Execution successful", output);
        return res.status(200).json({ message: "Execution successful", output:output.trim(), error:error.trim() });
    }
    catch(err)
    {
        logger.error("Execution failed", err.message);
        return res.status(500).json({ message: err.message });
    }
}
module.exports={execution}
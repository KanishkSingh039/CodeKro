const logger = require("@codekro/logger");
const fs=require("fs");
const path=require("path");
const {PassThrough}=require("stream");
const { dockerExecutor } = require("./dockerExecutor");
const execution = async (req, res) => {
    try {
        const { code, language, input } = req.body;
        if (!code || !language || !input)
            return res.status(400).json({ message: "Bad Request" });
        const workDir = path.resolve(
                    __dirname,
                    "../",
                    "temp_wdr"
                );
        fs.writeFileSync(path.join(workDir,"input.txt"),input);    
        fs.writeFileSync(path.join(workDir,`main.${language}`),code);
        let languageCommands = {
            "cpp": `g++ main.cpp -o program && ./program < input.txt`,
            "py": `python3 main.py < input.txt`,
            "java": `javac Main.java && java Main < input.txt`,
        };
        const command=languageCommands[language];
        const container=await dockerExecutor(language,command);
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
        if(fs.existsSync(path.join(workDir, "input.txt")))
        {
            fs.unlinkSync(path.join(workDir, "input.txt"));
        }
        if(fs.existsSync(path.join(workDir, `main.${language}`)))
        {
            fs.unlinkSync(path.join(workDir, `main.${language}`));
        }
        if(fs.existsSync(path.join(workDir, "program")))
        {
            fs.unlinkSync(path.join(workDir, "program"));
        }
        if(fs.existsSync(path.join(workDir, "Main.class")))
        {
            fs.unlinkSync(path.join(workDir, "Main.class"));
        }
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
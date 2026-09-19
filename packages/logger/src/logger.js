const logger=()=>{
    try {
        const log=(message,type)=>{
            if(!message){
                throw new Error("Message is required");
            }
            if(!type){
                throw new Error("Type is required");
            }
            const data=JSON.stringify(message);
            if(type==="error")console.error(data);
            if(type==="warn")console.warn(data);
            if(type==="info")console.info(data);
            if(type==="debug")console.log(data);
        }
            return {
                info(message){
                    return log(message,"info");
                },
                warn(message){
                    return log(message,"warn");
                },
                error(message){
                    return log(message,"error");
                },
                debug(message){
                    return log(message,"debug");
                }
            };
        
        
    } catch (error) {
        console.log(error);
        return error;
    }
}
module.exports=logger();
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { createLogger } from "https://deno.land/x/deno_structured_logging/mod.ts";

//logging
const logger = createLogger();
//envVariables
var variables = config();

class Rave  {

     pubKey:string;
     secKey:string;
     baseUrl:string;
     paymentMethod:string  = 'both';
     customLogo:string;
     customTitle:string;
     secretHash:string;
     txref:string;
     integrityHash:string;
     env:string = 'staging';
     transactionPrefix:string;
     urls:object = [
         "live" : "https://api.ravepay.co",
         "others" : "https://ravesandboxapi.flutterwave.com",
     ];
     transactionData:string;
     overrideTransactionReference:string;


    constructor(secKey:string, pubKey:string) {
        this.pubKey = pubKey;
        this.secKey = secKey;
    }

    function createCheckSum(params:type) {
        logger.info("Generating Checksum");
    }

    function initiate(params:type) {
        
    }

    
}

 var payment = new Rave(variables.RAVE_PUBLIC_KEY,variables.RAVE_SECRET_KEY);

 console.log('public key : '+ payment.pubKey);
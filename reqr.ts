import { soxa } from 'https://deno.land/x/soxa/mod.ts';
import { config } from "https://deno.land/x/dotenv/mod.ts";
 
const variables = config();

const seckey = variables.RAVE_SECRET_KEY;

let token = "Bearer "+ seckey;
console.log(token);
let url = 'https://ravesandboxapi.flutterwave.com/v3/payment-plans';

soxa.post(url,{},{
    headers: {'Authorization': token, 'Content-Type':'application/json'},
    data: {"amount":"5000","name": "biller-boy11","interval":"monthly","duration":"1"}
})
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
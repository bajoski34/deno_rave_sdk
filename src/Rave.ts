import { config } from "https://deno.land/x/dotenv/mod.ts";
import { createLogger } from "https://deno.land/x/deno_structured_logging/mod.ts";
import nanoid from "https://deno.land/x/nanoid/mod.ts";
import { Sha256 } from 'https://deno.land/std/hash/sha256.ts';
import { Md5 } from 'https://deno.land/std/hash/md5.ts';
// import { escapeHtml } from "https://raw.githubusercontent.com/ako-deno/escape_html/master/mod.ts";
import { soxa } from 'https://deno.land/x/soxa/mod.ts';
import { createRequire } from "https://deno.land/std/node/module.ts";
// var forge    = require('node-forge');
// var utf8     = require('utf8');



//logging
const logger = createLogger();
//envVariables
const variables = config();

const md5 = new Md5();

/**
 * Flutterwave's Rave payment gateway deno SDK
 * @author Olaobaju Abraham <olaobajua@gmail.com>
 * @version 1.0
 **/

interface IStringList {
    [key:string]:any
}

export class Rave  {

     pubKey:string = "";
     secKey:string = "";
     baseUrl:string = "";
     paymentOptions:string  = 'null';
     customLogo:string = "";
     customTitle:string = "";
     secretHash:string = "";
     txref:string = "";
     integrityHash:string = "";
     env:string = 'staging';
     transactionPrefix:string ="";
     authModelUsed:string = "";
     urls:{ live:string, test:string } = {
         live:"https://v3.flutterwave.com",
         test:"https://ravesandboxapi.flutterwave.com"
     };
     transactionData:IStringList = [];
     overrideTransactionReference:boolean;
     requeryCount:number = 0;
     verifyCount:number = 0;
     accountno:number = 0;
     amount:number = 0;
     card_no:number = 0;
     cvv:number = 0;
     expiry_month:number = 0;
     expiry_year:number = 0;
     customDescription:string = "";
     country:string = "";
     currency:string = "";
     customerEmail:string = "";
     customerFirstname:string = "";
     customerLastname:string = "";
     customerPhone:string = "";
     payButtonText:string = "";
     redirectUrl:string = "";
     end_point:string = "";
     handler:{} = {};
     prefix:string;
     overrideRefWithPrefix:boolean;
     meta:{} = {};



    constructor(secKey:string, pubKey:string,prefix:string = 'DV',overrideRefWithPrefix:boolean = false) {
        this.prefix = prefix;
        this.overrideRefWithPrefix = overrideRefWithPrefix;
        this.pubKey = pubKey;
        this.secKey = secKey;
        this.env = variables.RAVE_ENVIRONMENT;
        this.customLogo = variables.RAVE_LOGO;
        this.customTitle = variables.RAVE_TITLE;
        this.secretHash = variables.RAVE_SECRET_HASH;
        this.transactionPrefix = overrideRefWithPrefix ? prefix :this.prefix +'_';
        this.overrideTransactionReference = this.overrideRefWithPrefix;
        this.createReferenceNumber();

        if(this.env === 'live'){
            this.baseUrl = this.urls.live;
        }else{
            this.baseUrl = this.urls.test;
        }

        logger.info("Rave Class Initializes....");
       return this; 
    }

     createCheckSum() {

        logger.info("Generating Checksum....");
        const  options:IStringList = [];
            options["public_key"]= this.pubKey; 
            options["amount"] = this.amount;
            options["customer_email"] =this.customerEmail; 
            options["customer_firstname"] = this.customerFirstname; 
            options["txref"] = this.txref; 
            options["payment_options"] = this.paymentOptions;
            options["customer_lastname"] = this.customerLastname; 
            options["country"] = this.country;
            options["currency"] = this.currency; 
            options["custom_description"] = this.customDescription; 
            options["custom_logo"] = this.customLogo; 
            options["custom_title"] = this.customTitle; 
            options["customer_phone"] = this.customerPhone;
            options["pay_button_text"] = this.payButtonText;
            options["redirect_url"] = this.redirectUrl;
            options["hosted_payment"] = 1;
        ;
        console.table(options);

        //options.sort
        var sorteddata:IStringList = [];
        var hashedPayload = '';
        var o = this.ksort(options);
        o.forEach(function (value:any) {hashedPayload += options[value]; sorteddata[value] = options[value]});
            console.table(sorteddata);
         this.transactionData = sorteddata;

        
          
        
         
    console.log(`the hashedPayload: {hashedPayload}`);

        let completeHash = hashedPayload + this.secKey;
          const hash = new Sha256().update(completeHash).hex();
          console.log(hash);
          this.integrityHash = hash;
        return  this;
    }

     createReferenceNumber() {
        logger.info("Generating Reference Number....");
        if(this.overrideTransactionReference){
            this.txref = this.transactionPrefix;
        }else{
            this.txref = this.transactionPrefix + nanoid();
            
        }
        logger.info('Generated Reference Number....'+ this.txref);
        return this;
    }

    /**
     * gets the current transaction reference number for the transaction
     * @return string
     * */
     getReferenceNumber(){
        return this.txref;
    }

    /**
     * Sets the transaction amount
     * @param integer amount Transaction amount
     * @return object
     * */
     setAmount(amount:number){
        this.amount = amount;
        return this;
    }

    /**
     * Sets the transaction amount
     * @param integer amount Transaction amount
     * @return object
     * */
     setAccountNumber(accountno:number){
        this.accountno = accountno;
        return this;
    }

    /**
     * Sets the transaction transaction card number
     * @param integer card_no Transaction card number
     * @return object
     * */
     setCardNo(card_no:number){
        this.card_no = card_no;
        return this;
    }

    /**
     * Sets the transaction transaction CVV
     * @param integer CVV Transaction CVV
     * @return object
     * */
     setCVV(cvv:number){
        this.cvv = cvv;
        return this;
    }
    /**
     * Sets the transaction transaction expiry_month
     * @param integer expiry_month Transaction expiry_month
     * @return object
     * */
     setExpiryMonth(expiry_month:number){
        this.expiry_month = expiry_month;
        return this;
    }

    /**
     * Sets the transaction transaction expiry_year
     * @param integer  expiry_year Transaction expiry_year
     * @return object
     * */
    setExpiryYear(expiry_year:number){
        this.expiry_year = expiry_year;
        return this;
    }

      /**
     * Sets the transaction transaction end point
     * @param string  end_point Transaction expiry_year
     * @return object
     * */
     setEndPoint(end_point:string):object{
         this.end_point =  end_point;
        return  this;
    }


     /**
     * Sets the transaction authmodel
     * @param string  authmodel 
     * @return object
     * */
     setAuthModel(authmodel:string):object{
         this.authModelUsed =  authmodel;
        return  this;
    }
    
    
    /**
     * gets the transaction amount
     * @return string
     * */
     getAmount(){
        return this.amount;
    }
    
    /**
     * Sets the allowed payment methods
     * @param string  paymentOptions The allowed payment methods. Can be card, account or both 
     * @return object
     * */
     setPaymentOptions(paymentOptions:string):object{
         this.paymentOptions =  paymentOptions;
        return  this;
    }
    
    /**
     * gets the allowed payment methods
     * @return string
     * */
    getPaymentOptions(){
        return  this.paymentOptions;
    }
    
    /**
     * Sets the transaction description
     * @param string  customDescription The description of the transaction
     * @return object
     * */
     setDescription(customDescription:string){
         this.customDescription =  customDescription;
        return  this;
    }
    
    /**
     * gets the transaction description
     * @return string
     * */
     getDescription(){
        return  this.customDescription;
    }
    
    /**
     * Sets the payment page logo
     * @param string  customLogo Your Logo
     * @return object
     * */
     setLogo( customLogo:string){
         this.customLogo =  customLogo;
        return  this;
    }
    
    /**
     * gets the payment page logo
     * @return string
     * */
     getLogo(){
        return  this.customLogo;
    }
    
    /**
     * Sets the payment page title
     * @param string  customTitle A title for the payment. It can be the product name, your business name or anything short and descriptive 
     * @return object
     * */
     setTitle( customTitle:string){
         this.customTitle =  customTitle;
        return  this;
    }
    
    /**
     * gets the payment page title
     * @return string
     * */
     getTitle(){
        return  this.customTitle;
    }
    
    /**
     * Sets transaction country
     * @param string  country The transaction country. Can be NG, US, KE, GH and ZA
     * @return object
     * */
     setCountry(country:string){
         this.country =  country;
        return  this;
    }
    
    /**
     * gets the transaction country
     * @return string
     * */
     getCountry(){
        return  this.country;
    }
    
    /**
     * Sets the transaction currency
     * @param string  currency The transaction currency. Can be NGN, GHS, KES, ZAR, USD, EUR and GBP
     * @return object
     * */
     setCurrency(currency:string){
         this.currency =  currency;
        return  this;
    }
    
    /**
     * gets the transaction currency
     * @return string
     * */
     getCurrency(){
        return  this.currency;
    }
    
    /**
     * Sets the customer email
     * @param string  customerEmail This is the paying customer's email
     * @return object
     * */
     setEmail(customerEmail:string){
         this.customerEmail =  customerEmail;
        return  this;
    }
    
    /**
     * gets the customer email
     * @return string
     * */
     getEmail(){
        return  this.customerEmail;
    }
    
    /**
     * Sets the customer firstname
     * @param string  customerFirstname This is the paying customer's firstname
     * @return object
     * */
     setFirstname(customerFirstname:string){
         this.customerFirstname =  customerFirstname;
        return  this;
    }
    
    /**
     * gets the customer firstname
     * @return string
     * */
     getFirstname(){
        return  this.customerFirstname;
    }
    
    /**
     * Sets the customer lastname
     * @param string  customerLastname This is the paying customer's lastname
     * @return object
     * */
     setLastname(customerLastname:string){
         this.customerLastname =  customerLastname;
        return  this;
    }
    
    /**
     * gets the customer lastname
     * @return string
     * */
     getLastname(){
        return  this.customerLastname;
    }
    
    /**
     * Sets the customer phonenumber
     * @param string  customerPhone This is the paying customer's phonenumber
     * @return object
     * */
    setPhoneNumber(customerPhone:string){
         this.customerPhone =  customerPhone;
        return  this;
    }
    
    /**
     * gets the customer phonenumber
     * @return string
     * */
     getPhoneNumber(){
        return  this.customerPhone;
    }
    
    /**
     * Sets the payment page button text
     * @param string  payButtonText This is the text that should appear on the payment button on the Rave payment gateway.
     * @return object
     * */
     setPayButtonText(payButtonText:string){
         this.payButtonText =  payButtonText;
        return  this;
    }
    
    /**
     * gets payment page button text
     * @return string
     * */
     getPayButtonText(){
        return  this.payButtonText;
    }
    
    /**
     * Sets the transaction redirect url
     * @param string  redirectUrl This is where the Rave payment gateway will redirect to after completing a payment
     * @return object
     * */
    setRedirectUrl(redirectUrl:string){
         this.redirectUrl =  redirectUrl;
        return  this;
    }
    
    /**
     * gets the transaction redirect url
     * @return string
     * */
    getRedirectUrl(){
        return  this.redirectUrl;
    }
    
    /**
     * Sets the transaction meta data. Can be called multiple time to set multiple meta data
     * @param array  meta This are the other information you will like to store with the transaction. It is a key => value array. eg. PNR for airlines, product colour or attributes. Example. array('name' => 'femi')
     * @return object
     * */
    setMetaData(meta:{}){
         this.meta = meta;
        return  this;
    }
    
    /**
     * gets the transaction meta data
     * @return string
     * */
     getMetaData(){
        return this.meta;
    }
    
    /**
     * Sets the event hooks for all available triggers
     * @param object handler This is a class that implements the Event Handler Interface
     * @return object
     * */
     eventHandler(handler:object){
        this.handler = handler;
        return this;
    }

    postURL(data:{}){
        // make request to endpoint using unirest
        // let url = this.baseUrl+'/'+ this.end_point;
        let url = 'https://ravesandboxapi.flutterwave.com/v3/payment-plans';
        let token = 'Bearer '+ this.secKey;
        console.log(token);
        let headers:{} = {'Authorization': token, 'Content-Type':'application/json'};
        let response =  soxa.post(url,{}, {
            headers: headers,
            data: data
        });

        response.then(function (response) {
            console.log("resp:"+response.data.message);
        }).catch((error) => { console.error(error)});      
     }

     putURL(data:object){
        // make request to endpoint using unirest
        // let url = this.baseUrl+'/'+ this.end_point;
        let url = 'https://ravesandboxapi.flutterwave.com/v3/payment-plans';
        let token = 'Bearer '+ this.secKey;
        console.log(token);
         
        let response =  soxa.put(url,{}, {
            headers: {'Authorization': token, 'Content-Type':'application/json'},
            data: data
        });

        response.then(function (response) {
            console.log("resp:"+response.data.message);
        }).catch((error) => { console.error(error)});   
     }

      /**
     * this is the getKey function that generates an encryption Key for you.
     * @return string
     * */

     getKey(secretKey:string) {
        let sec_key = secretKey;
        let keymd5 = md5.update(sec_key).toString();
        console.log(keymd5);
        let keymd5last12 = keymd5.substr(-12);

        let seckeyadjusted = sec_key.replace('FLWSECK-', '');
        let seckeyadjustedfirst12 = seckeyadjusted.substr(0, 12);
        console.log(seckeyadjustedfirst12 + keymd5last12);
        return seckeyadjustedfirst12 + keymd5last12;
    }

     /**
     * this is the encrypt3Des function that generates an encryption Key for you by passing your transaction Data and Secret Key as a parameter.
     * @param string
     * @return string
     * */

    encrypt(key:string, text:string)
    {
       
        var cipher   = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(key));
        cipher.start({iv:''});
        cipher.update(forge.util.createBuffer(text, 'utf-8'));
        cipher.finish();
        var encrypted = cipher.output;
        return ( forge.util.encode64(encrypted.getBytes()) );
    }
    /**
     * this is the encryption function that combines the getkey() and encryptDes().
     * @param string
     * @return string
     * */

     encryption(options:string){
         //encrypt and return the key using the secrekKey
         this.key = this.getKey(this.secKey);
         //set the data to transactionData
         this.transactionData = options;
         //encode the data and the 
        return this.encrypt3Des( this.transactionData,  this.key);
    }
    
         initialize() {
        this.createCheckSum();
        this.transactionData['integrity_hash'] = this.integrityHash;
        this.transactionData['meta'] = this.meta;
        console.table(this.transactionData);

        //assigned class property to a variable
            var dd = this.transactionData;
        //key sort
       
        //converting array to object
        const entries:IStringList = {};
        var o = this.ksort(this.transactionData);
        
        o.forEach(function (value:string) {entries[value] =  dd[value]});

        //converts the object entries to json
        var json = JSON.stringify(entries);
        var html = '<html><body>'
        +'<center>Proccessing...<br /><img src="ajax-loader.gif" /></center>'+
        //'.this.baseUrl.'/flwv3-pug/getpaidx/api/flwpbf-inline.js
        //https://checkout.flutterwave.com/v3.js - inline
        + '<script type="text/javascript" src="https://checkout.flutterwave.com/v3.js"></script>'
        +'<script>'
	    +'document.addEventListener("DOMContentLoaded", function(event) {'
        + 'var data = JSON.parse(\''+json+'\');';
        +'getpaidSetup(data);'+
        + '});'+
        + '</script>'+
        +'</body>'+
        +'</html>';
        console.dir(html);

        return json;
    }

     ksort(arr:object) {
        console.table(Object.keys(arr).sort());  
       return Object.keys(arr).sort();  

   }



    }



    


 

 
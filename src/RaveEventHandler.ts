interface EventHandlerInterface{
    /**
     * This is called only when a transaction is successful
     * @param object $transactionData This is the transaction data as returned from the Rave payment gateway
     * */
     onSuccessful(transactionData:object):void;
    
    /**
     * This is called only when a transaction failed
     * @param object $transactionData This is the transaction data as returned from the Rave payment gateway
     * */
     onFailure(transactionData:object):void;
    
    /**
     * This is called when a transaction is requeryed from the payment gateway
     * @param string $transactionReference This is the transaction reference as returned from the Rave payment gateway
     * */
     onRequery(transactionReference:string):void;
    
    /**
     * This is called a transaction requery returns with an error
     * @param string $requeryResponse This is the error response gotten from the Rave payment gateway requery call
     * */
     onRequeryError(requeryResponse:string):void;
    
    /**
     * This is called when a transaction is canceled by the user
     * @param string $transactionReference This is the transaction reference as returned from the Rave payment gateway
     * */
     onCancel(transactionReference:string):void;
    
    /**
     * This is called when a transaction doesn't return with a success or a failure response.
     * @param string $transactionReference This is the transaction reference as returned from the Rave payment gateway
     * @data object $data This is the data returned from the requery call.
     * */
     onTimeout(transactionReference:string,data:object):void;
}



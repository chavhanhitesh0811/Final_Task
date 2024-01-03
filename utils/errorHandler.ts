class ErrorHandler{
    
    constructor(public message : string, public statusCode : number)
    {
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default ErrorHandler;
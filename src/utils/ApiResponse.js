class ApiResponse {
    constructor( statusCode,message="success", data) {
        this.success = statusCode;
        this.message = message;
        this.data = data;
    }
}
export { ApiResponse };
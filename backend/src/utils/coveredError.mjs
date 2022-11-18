const CoveredError = class extends Error {
    constructor(statusCode, errorMessage) {
        super(errorMessage);

        this.statusCode = statusCode;
        this.errorMessage = errorMessage || "Unknown error";
    }
};

export default CoveredError;

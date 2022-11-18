const okJsonResponse = (messageText, data, status = "OK") => {
    return {
        status: status,
        message: messageText,
        data: data ? data : null,
    };
};

const errorJsonResponse = (error, messageText) => {
    return {
        status: error.statusCode || "ERROR",
        message: error.message || messageText,
        error: [
            {
                name: error.name,
                stack: error.stack,
            },
        ],
    };
};

export { okJsonResponse, errorJsonResponse };

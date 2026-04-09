interface ApiErrorType {
  message: string;
  statusCode: number;
}

// Custom API error class can use it to throw error with message and status code
class ApiError extends Error {
  statusCode: number;
  constructor({ message, statusCode }: ApiErrorType) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ApiError;

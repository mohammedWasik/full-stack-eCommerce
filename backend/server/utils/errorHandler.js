// export class ErrorHandler extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.statusCode = statusCode;

//     Error.captureStackTrace(this, this.constructor);
//   }
// }

export function ErrorHandler(message, statusCode) {
  return {
    statusCode: statusCode,
    message: message,
    stack: new Error().stack,
  };
}

// ErrorHandler.prototype = new Error();

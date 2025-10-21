import { HTTP_STATUS } from '../config/constants.js';

/**
 * Standard success response wrapper
 */
export const successResponse = (res, data, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standard error response wrapper
 */
export const errorResponse = (res, message = 'Error occurred', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Success response with data (200)
 */
export const sendSuccess = (res, data, message = 'Success') => {
  return successResponse(res, data, message, HTTP_STATUS.OK);
};

/**
 * Created response (201)
 */
export const sendCreated = (res, data, message = 'Resource created successfully') => {
  return successResponse(res, data, message, HTTP_STATUS.CREATED);
};

/**
 * Bad Request error (400)
 */
export const sendBadRequest = (res, message = 'Bad request', errors = null) => {
  return errorResponse(res, message, HTTP_STATUS.BAD_REQUEST, errors);
};

/**
 * Unauthorized error (401)
 */
export const sendUnauthorized = (res, message = 'Unauthorized') => {
  return errorResponse(res, message, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * Forbidden error (403)
 */
export const sendForbidden = (res, message = 'Forbidden') => {
  return errorResponse(res, message, HTTP_STATUS.FORBIDDEN);
};

/**
 * Not Found error (404)
 */
export const sendNotFound = (res, message = 'Resource not found') => {
  return errorResponse(res, message, HTTP_STATUS.NOT_FOUND);
};

/**
 * Conflict error (409)
 */
export const sendConflict = (res, message = 'Resource conflict') => {
  return errorResponse(res, message, HTTP_STATUS.CONFLICT);
};

/**
 * Validation error (422)
 */
export const sendValidationError = (res, errors, message = 'Validation failed') => {
  return errorResponse(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
};

/**
 * Internal Server Error (500)
 */
export const sendServerError = (res, message = 'Internal server error') => {
  return errorResponse(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

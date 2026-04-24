// Constant to replace hard coding (as const -> read only)

// BCRYPT
export const BCRYPT = {
  SALT_ROUNDS: 12,
} as const;

// JWT
export const JWT = {
  EXPIRES_DURATION: '1h',
};

// Request Headers
export const AuthHeaders = {
  BEARER: 'Bearer ',
};

// HTTP Status Code
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORISED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ROLES = {
  STUDENT: 'student',
  TRAINER: 'trainer',
  ADMIN: 'admin',
} as const;

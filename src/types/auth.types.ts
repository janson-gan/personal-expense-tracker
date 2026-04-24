// Shape of data expected in register
export interface RegisterType {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'trainer' | 'admin';
}

// Shape of data expected in login
export interface LoginType {
  email: string;
  password: string;
}

// Properties inside JWT
export interface JWTPayloadType {
  userId: string;
  email: string;
  role: 'student' | 'trainer' | 'admin';
}

// Extend Express request to include the decoded user JWT 
export interface AuthenticatedRequest extends Express.Request {
  user?: JWTPayloadType;
}

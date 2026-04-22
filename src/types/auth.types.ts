export interface RegisterType {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'trainer' | 'admin';
}

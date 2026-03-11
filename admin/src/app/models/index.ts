export interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  quizzes?: Quiz[];
}

export interface Quiz {
  id: number;
  userId: number;
  title: string;
  description?: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
  questions?: Question[];
}

export interface Question {
  id: number;
  quizId: number;
  title: string;
  answer: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

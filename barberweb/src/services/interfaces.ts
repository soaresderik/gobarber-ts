export interface IAuthenticate {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface INotification {
  read: boolean;
  _id: string;
  content: string;
  user: number;
  createdAt: string;
}

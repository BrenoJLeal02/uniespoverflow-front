import { UUID } from 'crypto';
import { Comment } from './CommentsInterface';

export interface UserSignIn {
  email?: string;
  username?: string;
  password: string;
}
export interface UserSingUp {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface UserForgotPassword {
  email: string;
}
export interface UserResetPassword {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
export interface User {
  name: string;
  username: string;
  bio_description?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  admin_user_block: boolean;
  posts?: UserPostInfo[];
}
export interface ProfileInfos {
  id: UUID;
  name: string;
  username: string;
  email: string;
  bio_description?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  role: Role;
  admin_user_block: boolean;
  posts?: UserPostInfo[];
}
export interface UpdateProfileInfos {
  name: string;
  username: string;
  email: string;
  bio_description?: string;
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
}

export interface UserCardData {
  id: UUID;
  name: string;
  username: string;
  postCount: number;
}
export interface UserResponse {
  users: UserCardData[];
  totalPages: number;
  page: string;
  limit: string;
}
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export interface UserCreatePost {
  title: string;
  description: string;
  tags: string[];
}
export interface UserUpdatePost{
  title: string;
  description: string;
  tags: string[];
}

export interface UserPostInfo {
  id: string | UUID;
  username: string;
  title: string;
  description: string;
  score: number;
  status_open: boolean;
  created_at: string | number;
  updated_at: string;
  tags: string[];
  commentCount?: number;
}
export interface UserPostById {
  id: string | UUID;
  user_id: string;
  title: string;
  description: string;
  score: number;
  status_open: boolean;
  created_at: string;
  updated_at: string;
  admin_post_block: boolean;
  comment: Comment[];
  tags: string[];
  username: string;
}


export interface UserNotifications {
  username: string;
  created_at: string | Date;
  content: string;
  post_id: UUID | string;
  isNew: boolean;
}

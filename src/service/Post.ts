import { UUID } from 'crypto';
import { UserPostInfo, UserCreatePost, UserPostById, UserUpdatePost } from '../interface/UserInterface';
import api from '../service/api';

const createPost = async (data: UserCreatePost) => {
  const response = await api.post(`/posts`, data);
  return response;
};

const updateUserPost = async(id: string | UUID, data: UserUpdatePost) =>{
  const response = await api.put(`/posts/${id}`, data)
  return response
}

const deleteUserPost = async (id:string | UUID) => {
  await api.delete(`/posts/${id}`);
};

const fetchPosts = async (): Promise<UserPostInfo[]> => {
  const response = await api.get<UserPostInfo[]>('/public/posts');
  return response.data;
};

const fetchPostsByUserId = async (id: string|  UUID): Promise<UserPostInfo[]> => {
  const response = await api.get<UserPostInfo[]>(`/public/posts/user/${id}`);
  return response.data;
};

const fetchPostById = async (id: string | UUID): Promise<UserPostById> => {
  const response = await api.get<UserPostById>(`/public/posts/${id}`);
  return response.data;
}


export { createPost, fetchPosts, fetchPostsByUserId, fetchPostById, deleteUserPost,updateUserPost };

import { UserPostLikeAndDislike } from "../interface/UserInterface";
import api from "./api";

const createUserLike= async (id: string, data: UserPostLikeAndDislike) => {
  const response = await api.post(`/posts/${id}/like`, data);

  return response;
};
  const createUserDislike= async (id: string, data: UserPostLikeAndDislike) => {
    const response = await api.post(`/posts/${id}/dislike`, data);

    return response;
  };
  export {createUserLike, createUserDislike};
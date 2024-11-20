import { CreateComment, UpdateComment} from "../interface/CommentsInterface";
import api from "./api";
import { UUID } from 'crypto';

const createUserComment = async (id: string | UUID  ,data: CreateComment) => {
    const response = await api.post(`/comments/post/${id}`, data);
    return response;
  };

const updateUserComment = async(id: string | UUID, data: UpdateComment) =>{
  const response = await api.patch(`/comments/${id}`, data)
  return response
}
const deleteUserComment = async (id: UUID) => {
  await api.delete(`/comments/${id}`);
};

export{createUserComment, updateUserComment, deleteUserComment}
  
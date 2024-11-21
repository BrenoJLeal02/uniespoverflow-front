import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Comment, UpdateComment } from '../interface/CommentsInterface';

export interface CommentState {
  comments: Comment[] | undefined;
  setComments: (comments: Comment[]) => void;
  getComments: () => Comment[] | undefined;
  resetComments: () => void;
  updateComment: (updatedComment: UpdateComment) => void;
  removeComment: (id: string) => void;
}

const commentStoreApi: StateCreator<CommentState> = (set, get) => ({
  comments: undefined,

  setComments: (comments) => set({ comments }),

  getComments: () => {
    const state = get();
    return state.comments;
  },

  resetComments: () => set({ comments: undefined }),

  updateComment: async (updatedComment: UpdateComment) => {
    try {
      set((state) => {
        if (state.comments) {
          const updatedComments = state.comments.map((comment) =>
            comment.id === updatedComment.id ? { ...comment, ...updatedComment } : comment
          );
          return { comments: updatedComments };
        }
        return state;
      });
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
    }
  },

  removeComment: async (id: string) => {
    try {
      set((state) => {
        if (state.comments) {
          const filteredComments = state.comments.filter((comment) => comment.id !== id);
          return { comments: filteredComments };
        }
        return state;
      });
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
    }
  },
});

export const useCommentStore = create<CommentState>()(
  devtools(persist(commentStoreApi, { name: 'comment' })) 
);

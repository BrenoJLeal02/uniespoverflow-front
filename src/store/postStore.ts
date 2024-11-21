import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { fetchPostById, fetchPostsByUserId, updateUserPost, deleteUserPost } from '../service/Post';
import { UserPostInfo, UserPostById, Role } from '../interface/UserInterface';
import { UUID } from 'crypto';

export interface PostState {
  posts?: UserPostInfo[];
  post?: UserPostById;
  role?: Role;

  setPosts: (id: string | UUID) => Promise<void>;
  getPosts: () => UserPostInfo[] | undefined;
  getPostById: (id: string | UUID) => Promise<void>;
  resetPosts: () => void;
  updatePost: (id: string | UUID, updatedPost: UserPostInfo) => Promise<void>;
  removePost: (id: string | UUID) => Promise<void>;
  incrementCommentCount: (postId: string | UUID) => void;
}

const storeApi: StateCreator<PostState> = (set, get) => ({
  posts: undefined,
  post: undefined,
  role:undefined,

  setPosts: async (id: string | UUID) => {
    try {
      const posts = await fetchPostsByUserId(id);

  
      const sortedPosts = posts.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      set({ posts: sortedPosts });
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  },

  getPosts: () => {
    const state = get();
    return state.posts;
  },

  getPostById: async (id: string | UUID) => {
    try {
      const post = await fetchPostById(id);
      
      const sortedComments = post.comment.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      set({ post: { ...post, comment: sortedComments } });
    } catch (error) {
      console.error('Erro ao buscar post por ID:', error);
    }
  },

  updatePost: async (id: string | UUID, updatedPost: UserPostInfo) => {
    try {
      await updateUserPost(id, updatedPost);
      set((state) => {
        if (state.posts) {
          const updatedPosts = state.posts.map((post) =>
            post.id === id ? { ...post, ...updatedPost } : post
          );
          return { posts: updatedPosts };
        }
        return state;
      });
      const post = await fetchPostById(id); 
      set({ post });
    } catch (error) {
      console.error('Erro ao editar post:', error);
    }
  },

  removePost: async (id: string | UUID) => {
    try {
      await deleteUserPost(id);
      set((state) => {
        if (state.posts) {
          const filteredPosts = state.posts.filter(post => post.id !== id);
          return { posts: filteredPosts };
        }
        return state;
      });
    } catch (error) {
      console.error('Erro ao excluir post:', error);
    }
  },

  incrementCommentCount: (postId: string | UUID) => {
    set((state) => {
      if (state.posts) {
        const updatedPosts = state.posts.map((post) =>
          post.id === postId
            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
            : post
        );
        return { posts: updatedPosts };
      }
      return state;
    });
  },

  resetPosts: () => {
    set({ posts: undefined, post: undefined });
  },

});
export const usePostStore = create<PostState>()(
  devtools(persist(storeApi, { name: 'post-storage' }))
);

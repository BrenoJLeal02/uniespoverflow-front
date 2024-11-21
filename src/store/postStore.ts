import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { fetchPostsByUserId } from '../service/Post';
import { UserPostInfo } from '../interface/UserInterface';
import { UUID } from 'crypto';

export interface PostState {
  posts?: UserPostInfo[];

  setPosts: (id: UUID) => Promise<void>;
  getPosts: () => UserPostInfo[] | undefined;
  resetPosts: () => void;
  updatePost: (updatedPost: UserPostInfo) => void;
  removePost: (id: string | UUID) => void;
  incrementCommentCount: (postId: string | UUID) => void;
}

const storeApi: StateCreator<PostState> = (set, get) => ({
  posts: undefined,

  setPosts: async (id: UUID) => {
    try {
      const posts = await fetchPostsByUserId(id);
      set({ posts });
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  },

  getPosts: () => {
    const state = get(); 
    return state.posts;  
  },

  resetPosts: () => {
    set({ posts: undefined });
  },

  updatePost: (updatedPost: UserPostInfo) => {
    set((state) => {
      if (state.posts) {
        const updatedPosts = state.posts.map((post) =>
          post.id === updatedPost.id ? { ...post, ...updatedPost } : post
        );
        return { posts: updatedPosts };
      }
      return state;
    });
  },

  removePost: (id: string | UUID) => {
    set((state) => {
      if (state.posts) {
        const filteredPosts = state.posts.filter(post => post.id !== id);
        return { posts: filteredPosts };
      }
      return state;
    });
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
});

export const usePostStore = create<PostState>()(
  devtools(persist(storeApi, { name: 'post-storage' }))
);

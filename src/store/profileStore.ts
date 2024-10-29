import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { fetchMyProfile } from '../service/Auth';
import { MyProfileInfos, Role } from '../interface/UserInterface';

export interface profileState {
  user?: MyProfileInfos;
  role?: Role;

  getProfile: (token: string) => Promise<void>;
  setProfile: (user: MyProfileInfos) => void;
  resetUser: () => void;
}
const storeApi: StateCreator<profileState> = (set) => ({
  user: undefined,

  getProfile: async (token: string) => {
    try {
      const user = await fetchMyProfile(token);
      set({ user, role: user.role });
    } catch (error) {
      console.error(error);
    }
  },
  setProfile(user) {
    try {
      set({ user });
    } catch (error) {
      console.error(error);
    }
  },
  resetUser: () => {
    set({ user: undefined });
  },
});
export const useProfileStore = create<profileState>()(
  devtools(persist(storeApi, { name: 'profile-storage' }))
);
import type { StateCreator } from "zustand";
import { type SideBarRole } from "../../types";

type user = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};
type userInfo = {
  token: string;
  user: user;
};

type LoginStoreState = {
  sideBarRole: SideBarRole;
  userInfo: userInfo;
  role: string;
};

type LoginStoreActions = {
  setUserInfo: (payload: userInfo) => void;
  setRole: (role: string) => void;
  clearUserInfo: () => void;
  logout: () => void;
  openPopup: (role: SideBarRole) => void;
  closePopup: () => void;
};

export interface ILoginSlice {
  login: LoginStoreState & LoginStoreActions;
}

const createLoginSlice: StateCreator<ILoginSlice> = (set) => ({
  login: {
    sideBarRole: "",
    userInfo: null,
    role: "",
    setRole: (role) => {
      set((state) => ({
        login: {
          ...state.login,
          role: role,
        },
      }));
    },
    setUserInfo: (payload) => {
      set((state) => ({
        login: {
          ...state.login,
          userInfo: payload,
        },
      }));
    },
    clearUserInfo: () => {
      set((state) => ({
        login: {
          ...state.login,
          role: "",
          userInfo: null,
        },
      }));
    },
    logout: () => {
      set((state) => ({ login: { ...state.login, sideBarRole: "" } }));
    },
    openPopup: (role) =>
      set((state) => ({ login: { ...state.login, sideBarRole: role } })),
    closePopup: () =>
      set((state) => ({ login: { ...state.login, sideBarRole: "" } })),
  },
});

export default createLoginSlice;

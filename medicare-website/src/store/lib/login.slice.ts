import type { StateCreator } from "zustand";
import { type SideBarRole } from "../..//types";

type userInfo = {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
};

type LoginStoreState = {
  sideBarRole: SideBarRole;
  userInfo: userInfo;
};

type LoginStoreActions = {
  setUserInfo: (payload: userInfo) => void;
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
          userInfo: null,
        },
      }));
    },
    logout: () => {
      set((state) => ({ login: { ...state.login, sideBarRole: "" } }));
      localStorage.removeItem("userInfo");
    },
    openPopup: (role) =>
      set((state) => ({ login: { ...state.login, sideBarRole: role } })),
    closePopup: () =>
      set((state) => ({ login: { ...state.login, sideBarRole: "" } })),
  },
});

export default createLoginSlice;

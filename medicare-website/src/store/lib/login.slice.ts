import type { StateCreator } from "zustand";
import { type SideBarRole } from "../..//types";

type LoginStoreState = {
  isLoggedIn: boolean;
  sideBarRole: SideBarRole;
};

type LoginStoreActions = {
  login: () => void;
  logout: () => void;
  openPopup: (role: SideBarRole) => void;
  closePopup: () => void;
};

export interface ILoginSlice {
  login: LoginStoreState & LoginStoreActions;
}

const createLoginSlice: StateCreator<ILoginSlice> = (set) => ({
  login: {
    isLoggedIn: false,
    sideBarRole: "",
    login: () =>
      set((state) => ({ login: { ...state.login, isLoggedIn: true } })),
    logout: () =>
      set((state) => ({ login: { ...state.login, isLoggedIn: false } })),
    openPopup: (role) =>
      set((state) => ({ login: { ...state.login, sideBarRole: role } })),
    closePopup: () =>
      set((state) => ({ login: { ...state.login, sideBarRole: "" } })),
  },
});

export default createLoginSlice;

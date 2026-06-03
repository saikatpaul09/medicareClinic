import type { StateCreator } from "zustand";
import { type SideBarRole } from "../..//types";

type LoginStoreState = {
  sideBarRole: SideBarRole;
};

type LoginStoreActions = {
  login: (payload: {
    _id: string;
    name: string;
    email: string;
    role: string;
  }) => void;
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
    login: (payload) =>
      localStorage.setItem("userInfo", JSON.stringify(payload)),
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

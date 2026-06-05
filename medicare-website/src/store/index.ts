import { create } from "zustand";
import createLoginSlice, { type ILoginSlice } from "./lib/login.slice";

const useAuthStore = create<ILoginSlice>()((...args) => ({
  ...createLoginSlice(...args),
}));

export default useAuthStore;

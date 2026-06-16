import { create } from "zustand";
import createLoginSlice, { type ILoginSlice } from "./lib/auth.slice";

const useAuthStore = create<ILoginSlice>()((...args) => ({
  ...createLoginSlice(...args),
}));

export default useAuthStore;

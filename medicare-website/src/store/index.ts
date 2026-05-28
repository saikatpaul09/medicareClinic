import { create } from "zustand";
import createLoginSlice, { type ILoginSlice } from "./lib/login.slice";

const useBoundStore = create<ILoginSlice>()((...args) => ({
  ...createLoginSlice(...args),
}));

export default useBoundStore;

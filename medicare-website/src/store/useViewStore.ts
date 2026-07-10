import { create } from "zustand";
import createViewSlice, { type IViewSlice } from "./lib/view.slice";

const useViewStore = create<IViewSlice>()((...args) => ({
  ...createViewSlice(...args),
}));

export default useViewStore;

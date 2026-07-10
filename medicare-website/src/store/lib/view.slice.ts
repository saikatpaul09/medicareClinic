import type { StateCreator } from "zustand";

type ViewState = {
  isSearchView: boolean;
};
type ViewActions = {
  setSearchView: (isSearchView: boolean) => void;
};
export interface IViewSlice {
  view: ViewState & ViewActions;
}
const createViewSlice: StateCreator<IViewSlice> = (set) => ({
  view: {
    isSearchView: false,
    setSearchView: (isSearchView) => {
      set((state) => ({
        view: {
          ...state.view,
          isSearchView: isSearchView,
        },
      }));
    },
  },
});

export default createViewSlice;

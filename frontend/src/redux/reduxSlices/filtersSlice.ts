import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  listingType: string | undefined;
  keyword: string | undefined;
  status: string | undefined;
  sorting: { sortKey: string | undefined; sortValue: string | undefined };
}

const initialState: FiltersState = {
  listingType: undefined,
  keyword: undefined,
  status: undefined,
  sorting: { sortKey: undefined, sortValue: undefined },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setListingType: (state, action: PayloadAction<string | undefined>) => {
      state.listingType = action.payload;
    },
    setKeyword: (state, action: PayloadAction<string | undefined>) => {
      state.keyword = action.payload;
    },
    setStatus: (state, action: PayloadAction<string | undefined>) => {
      state.status = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ sortKey: string | undefined; sortValue: string | undefined }>) => {
      state.sorting = action.payload;
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const { setListingType, setKeyword, setStatus, setSorting, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

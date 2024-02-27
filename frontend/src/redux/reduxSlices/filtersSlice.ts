import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  isLoading: boolean;
  status: string | undefined;
  category: string | undefined;
  bedrooms: string | undefined,
  bathrooms: string | undefined,
  listingType: string | undefined;
  keyword: string | undefined;
  direction: string | undefined;
  priceRange: number[] | undefined;
  areaRange: number[] | undefined;
  sorting: { sortKey: string | undefined; sortValue: string | undefined };
}

const initialState: FiltersState = {
  isLoading: true,
  listingType: undefined,
  keyword: undefined,
  status: undefined,
  direction: undefined,
  category: undefined,
  priceRange: undefined,
  areaRange: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  sorting: { sortKey: undefined, sortValue: undefined },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setListingType: (state, action: PayloadAction<string | undefined>) => {
      state.listingType = action.payload;
    },

    setDirection: (state, action: PayloadAction<string | undefined>) => {
      state.direction = action.payload;
    },

    setKeyword: (state, action: PayloadAction<string | undefined>) => {
      state.keyword = action.payload;
    },

    setBedrooms: (state, action: PayloadAction<string | undefined>) => {
      state.bedrooms = action.payload;
    },

    setBathrooms: (state, action: PayloadAction<string | undefined>) => {
      state.bathrooms = action.payload;
    },

    setStatus: (state, action: PayloadAction<string | undefined>) => {
      state.status = action.payload;
    },

    setCategory: (state, action: PayloadAction<string | undefined>) => {
      state.category = action.payload;
    },

    setSorting: (state, action: PayloadAction<{ sortKey: string | undefined; sortValue: string | undefined }>) => {
      state.sorting = action.payload;
    },

    setPriceRange: (state, action: PayloadAction<number[] | undefined>) => {
      state.priceRange = action.payload;
    },

    setAreaRange: (state, action: PayloadAction<number[] | undefined>) => {
      state.areaRange = action.payload;
    },

    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const { 
  setIsLoading, 
  setListingType, 
  setKeyword, 
  setStatus, 
  setCategory,
  setDirection,               
  setPriceRange, 
  setBedrooms,
  setBathrooms,
  setAreaRange,
  setSorting, 
  resetFilters
 } = filtersSlice.actions;
export default filtersSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyType } from '../../../../backend/commonTypes';

// Combined type for all property post data (including extra fields)
interface PropertyPostFull extends Omit<PropertyType, 'slug' | 'createdAt' | 'deleted'> {
  submitFirstPage: boolean;
  submitSecondPage: boolean;
  allowNextStep: boolean;
  totalPayment: number;
}

const initialState: PropertyPostFull = {
  submitFirstPage: false,
  submitSecondPage: false,
  allowNextStep: false,
  totalPayment: 0,
  title: '',
  status: 'active',
  postType: '',
  position: null,
  description: undefined,
  area: {
    propertyWidth: null,
    propertyLength: null,
  },
  view: null,
  price: null,
  images: [],
  location: undefined,
  listingType: '',
  propertyDetails: undefined,
  postServices: undefined,
  expireTime: undefined,
};

export const propertyPostSlice = createSlice({
  name: 'propertyPost',
  initialState,
  reducers: {
    setPost: (_, action: PayloadAction<typeof initialState>) => {
      return action.payload;
    },

    setSubmitFirstPage: (state, action: PayloadAction<boolean>) => {
      state.submitFirstPage = action.payload;
    },

    setSubmitSecondPage: (state, action: PayloadAction<boolean>) => {
      state.submitSecondPage = action.payload;
    },

    setAllowNextStep: (state, action: PayloadAction<boolean>) => {
      state.allowNextStep = action.payload;
    },
    
    setTotalPayment: (state, action: PayloadAction<number>) => {
      state.totalPayment = action.payload;
    },
  },
});

export const { setPost, setAllowNextStep, setSubmitFirstPage, setSubmitSecondPage } = propertyPostSlice.actions;

export default propertyPostSlice.reducer;

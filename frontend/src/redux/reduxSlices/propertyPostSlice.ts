import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyType } from '../../../../backend/commonTypes';

// Combined type for all property post data (including extra fields)
interface PropertyPostFull extends Omit<PropertyType, 'slug' | 'createdAt' | 'deleted'> {
  submitFirstPage: boolean;
  submitSecondPage: boolean;
  allowStep_2: boolean;
  allowStep_3: boolean;
  totalPayment: number;
}

const initialState: PropertyPostFull = {
  submitFirstPage: false,
  submitSecondPage: false,
  allowStep_2: false,
  allowStep_3: false,
  totalPayment: 0,
  title: '',
  status: undefined,
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

    setAllowStep2: (state, action: PayloadAction<boolean>) => {
      state.allowStep_2 = action.payload;
    },

    setAllowStep3: (state, action: PayloadAction<boolean>) => {
      state.allowStep_3 = action.payload;
    },
    
    setTotalPayment: (state, action: PayloadAction<number>) => {
      state.totalPayment = action.payload;
    },
  },
});

export const { setPost, setAllowStep2, setAllowStep3, setSubmitFirstPage, setSubmitSecondPage } = propertyPostSlice.actions;

export default propertyPostSlice.reducer;

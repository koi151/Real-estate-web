import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyType } from '../../../../backend/commonTypes';

type PropertyTypeExtraField = {
  submitRequest: boolean;
  allowNextStep: boolean;
};

type PropertyTypeForPosting<T extends PropertyTypeExtraField = { allowNextStep: boolean, submitRequest: boolean}> = Omit<
  PropertyType & T,
  'slug' | 'createdBy' | 'createdAt' | 'deleted'
>;

const initialState: Omit<PropertyTypeForPosting, 'slug' | 'createdBy' | 'createdAt' | 'deleted'> = {
  submitRequest: false,
  allowNextStep: false,

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
  expireTime: undefined,
};

export const propertyPostSlice = createSlice({
  name: 'propertyPost',
  initialState,
  reducers: {
    setPost: (_, action: PayloadAction<typeof initialState>) => {
      return action.payload;
    },
    setSubmitRequest: (state, action: PayloadAction<boolean>) => {
      state.submitRequest = action.payload;
    },
    setAllowNextStep: (state, action: PayloadAction<boolean>) => {
      state.allowNextStep = action.payload;
    }
  },
});

export const { setPost, setAllowNextStep, setSubmitRequest } = propertyPostSlice.actions;

export default propertyPostSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyType } from '../../../../backend/commonTypes';

type PropertyTypeExtraField = {
  submitFirstPage: boolean;
  submitSecondPage: boolean,
  allowNextStep: boolean;
};

type PropertyTypeForPosting<ExtraPropertyInfo extends PropertyTypeExtraField = { allowNextStep: boolean, submitFirstPage: boolean, submitSecondPage: boolean}> = Omit<
  PropertyType & ExtraPropertyInfo,
  'slug' | 'createdBy' | 'createdAt' | 'deleted'
>;

const initialState: Omit<PropertyTypeForPosting, 'slug' | 'createdBy' | 'createdAt' | 'deleted'> = {
  submitFirstPage: false,
  submitSecondPage: false,
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
    }
  },
});

export const { setPost, setAllowNextStep, setSubmitFirstPage, setSubmitSecondPage } = propertyPostSlice.actions;

export default propertyPostSlice.reducer;

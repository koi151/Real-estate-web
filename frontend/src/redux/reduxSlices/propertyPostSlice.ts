import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyType } from '../../../../backend/commonTypes';


const initialState: PropertyType = {
  _id: '',
  title: '',
  status: undefined,
  postType: '',
  position: undefined,
  description: '',
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
  createdBy : {
    accountId: '',
    accountType: undefined
  },  
  slug: '',
  createdAt: undefined,
  expireTime: undefined,
  deleted: undefined,
};

export const clientUserSlice = createSlice({
  name: 'propertyPost',
  initialState,
  reducers: {
    setPost: (_, action: PayloadAction<PropertyType>) => {
      return action.payload;
    },

    resetPostState: state => {
      return initialState;
    }
  },
});

export const { setPost, resetPostState } = clientUserSlice.actions;

export default clientUserSlice.reducer;

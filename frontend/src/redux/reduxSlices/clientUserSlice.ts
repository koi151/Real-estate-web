import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClientAccountType } from '../../../../backend/commonTypes';

type ClientAccountTypeLimited = Omit<
  ClientAccountType,
  'password' | 'token'
>;

const initialState: 
  Omit<ClientAccountTypeLimited, 'password' | 'token'> = 
  {
    avatar: '',
    createdAt: undefined,
    deleted: false,
    wallet: undefined,
    email: '',
    fullName: '',
    phone: '',
    postList: [],
    favoritePosts: [],
    status: undefined,
    updatedAt: undefined,
    _id: '',
  };

export const clientUserSlice = createSlice({
  name: 'clientUser',
  initialState,
  reducers: {
    setClientUser: (_, action: PayloadAction<ClientAccountType>) => {
      return action.payload;
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    resetClientUserState: state => {
      return initialState;
    }
  },
});

export const { setClientUser, setAvatar, resetClientUserState } = clientUserSlice.actions;

export default clientUserSlice.reducer;

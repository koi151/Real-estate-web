import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  avatar: string;
  createdAt: string;
  deleted: boolean;
  email: string;
  fullName: string;
  phone: string;
  postList: string[],
  favoritePosts: string[],
  status: string;
  updatedAt: string;
  _id: string;
}

const initialState: UserState = {
  avatar: '',
  createdAt: '',
  deleted: false,
  email: '',
  fullName: '',
  phone: '',
  postList: [],
  favoritePosts: [],
  status: '',
  updatedAt: '',
  _id: '',
};

export const clientUserSlice = createSlice({
  name: 'clientUser',
  initialState,
  reducers: {
    setClientUser: (_, action: PayloadAction<UserState>) => {
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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  avatar: string;
  createdAt: string;
  deleted: boolean;
  email: string;
  fullName: string;
  permissions: string[];
  phone: string;
  role_id: string;
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
  permissions: [],
  phone: '',
  role_id: '',
  status: '',
  updatedAt: '',
  _id: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
  },
});

export const { setUser, setAvatar } = userSlice.actions;

export default userSlice.reducer;

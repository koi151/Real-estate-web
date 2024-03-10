import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PermissionsState {
  permissions: Record<string, boolean> | null;
  isLoading: boolean;
}

const initialState: PermissionsState = {
  permissions: null,
  isLoading: false,
};

const adminPermissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermissions(state, action: PayloadAction<Record<string, boolean>>) {
      state.permissions = action.payload;
    },
  },
});

export const { setPermissions } = adminPermissionsSlice.actions;

export default adminPermissionsSlice.reducer;

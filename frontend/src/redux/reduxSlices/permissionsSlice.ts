import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PermissionsState {
  permissions: Record<string, boolean> | null;
}

const initialState: PermissionsState = {
  permissions: null,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermissions(state, action: PayloadAction<Record<string, boolean>>) {
      state.permissions = action.payload;
    },
  },
});

export const { setPermissions } = permissionsSlice.actions;

export default permissionsSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../reduxSlices/filtersSlice';
import permissionsReducer from '../reduxSlices/permissionsSlice'
import administratorUser from '../reduxSlices/userSlice'

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    currentUserPermissions: permissionsReducer,
    user: administratorUser
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

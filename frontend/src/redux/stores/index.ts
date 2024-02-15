import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../reduxSlices/filtersSlice';
import permissionsReducer from '../reduxSlices/permissionsSlice'

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    currentUserPermissions: permissionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

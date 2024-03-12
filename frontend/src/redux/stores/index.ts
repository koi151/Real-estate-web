import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../reduxSlices/filtersSlice';
import adminPermissionsReducer from '../reduxSlices/adminPermissionsSlice'
import administratorUser from '../reduxSlices/adminUserSlice'
import clientUser from '../reduxSlices/clientUserSlice'


export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    currentAdminUserPermissions: adminPermissionsReducer,
    adminUser: administratorUser,
    clientUser: clientUser
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../reduxSlices/filtersSlice';
import administratorUser from '../reduxSlices/adminUserSlice'
import clientUser from '../reduxSlices/clientUserSlice'
import propertyPost from '../reduxSlices/propertyPostSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    adminUser: administratorUser,
    clientUser: clientUser,
    propertyPost: propertyPost
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

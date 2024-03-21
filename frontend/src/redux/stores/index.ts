import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../reduxSlices/filtersSlice';
import administratorUser from '../reduxSlices/adminUserSlice'
import clientUser from '../reduxSlices/clientUserSlice'
import propertyPost from '../reduxSlices/propertyPostSlice';

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredActionPaths: [
          'payload.images', 
          'propertyPost.images.*',
          'propertyPost.expireDate.*',
          'propertyPost.images.*.lastModifiedDate'
        ], 
        ignoredPaths: [],
      },
    }),

  reducer: {
    filters: filtersReducer,
    adminUser: administratorUser,
    clientUser: clientUser,
    propertyPost: propertyPost
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

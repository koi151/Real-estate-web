import { combineReducers } from 'redux';
import filtersReducer from '../reduxSlices/filtersSlice';
import adminPermissionsReducer from '../reduxSlices/adminPermissionsSlice';
import adminUserReducer from '../reduxSlices/adminUserSlice';
import clientUserReducer from '../reduxSlices/clientUserSlice';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

// Persist configuration (ensures only 'adminUser' slice is persisted)
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['adminUser', 'clientUser'],
  expire: {
    adminUser: 24 * 60 * 60 * 1000, // 1d
    clientUser: 24 * 60 * 60 * 1000, 
  },
};

const rootReducer = combineReducers({
  filters: filtersReducer,
  currentAdminUserPermissions: adminPermissionsReducer,
  adminUser: adminUserReducer,
  clientUser: clientUserReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export default persistedReducer;



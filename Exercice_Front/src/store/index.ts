import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import type { PersistConfig } from 'redux-persist/lib/types';
import localForage from 'localforage';

import patientsReducer from './patients/slice';
import medicationsReducer from './medications/slice';
import prescriptionsReducer from './prescriptions/slice';

/**
 * Store Redux persisté via localForage (IndexedDB).
 * Combine les trois domaines : patients, médicaments, prescriptions.
 */
const rootReducer = combineReducers({
  patientsReducer,
  medicationsReducer,
  prescriptionsReducer,
});

type RootReducerState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootReducerState> = {
  key: 'root',
  storage: localForage,
  version: 1,
  whitelist: [
    'patientsReducer',
    'medicationsReducer',
    'prescriptionsReducer',
  ],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
  enhancers: getDefaultEnhancers => getDefaultEnhancers(),
});

const persistor = persistStore(store);

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

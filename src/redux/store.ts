import { configureStore } from '@reduxjs/toolkit';
import { DefaultRootState } from 'react-redux';
import { rootReducer } from './rootReducer';

export const store = configureStore({
	reducer: rootReducer,
});

export type IGlobalState = DefaultRootState & ReturnType<typeof store.getState>;

import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import {
	IAuthModalState,
	IAuthResponse,
	IAuthState,
} from '../../types/auth.types';
import AuthUtils from '../../utils/auth.utils';
import { IGlobalState } from '../store';

export const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

const initialState: IAuthState = {
	access_token: AuthUtils.getLocalStorage('auth_details')?.access_token,
	user: AuthUtils.getLocalStorage('auth_details')?.user,
	isAuthenticated: false,
	error: {
		isError: false,
		message: null,
	},
	isLoading: false,
	isLoaded: false,
};

/**
 * @description - To load user using token in local storage on page refresh or fresh page visit
 */
const loaduser = createAsyncThunk(
	'auth/loaduser',
	async (_: void, { dispatch }) => {
		try {
			dispatch(request());
			const { data }: { data: IAuthResponse } = await axios.get(
				`${SERVER_URI}/user/me`
			);

			dispatch(success(data));
		} catch (err) {
			dispatch(error(null));
		}
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		/**
		 * Logour user
		 */
		logout: (state) => {
			AuthUtils.removeLocalStorage('auth_details');
			AuthUtils.setAuthToken();

			state.access_token = null;
			state.error = {
				isError: false,
				message: null,
			};
			state.isAuthenticated = false;
			state.isLoaded = false;
			state.isLoading = false;
			state.user = null;
		},

		/**
		 * Change request status
		 */
		request: (state) => {
			state.error = {
				isError: false,
				message: null,
			};
			state.isLoading = true;
			state.isLoaded = false;
		},

		/**
		 * Handle Auth Error
		 */
		error: (
			state,
			{ payload }: { payload: IAuthState['error']['message'] }
		) => {
			AuthUtils.removeLocalStorage('auth_details');
			AuthUtils.setAuthToken();

			state.access_token = null;
			state.isAuthenticated = false;
			state.error = {
				isError: true,
				message: payload,
			};
			state.isLoading = false;
			state.isLoaded = true;
		},

		/**
		 * Handle Auth Request Success
		 */
		success: (state, { payload }: { payload: IAuthResponse }) => {
			AuthUtils.setLocalStorage('auth_details', payload);
			AuthUtils.setAuthToken();

			state.access_token = payload.access_token;
			state.isAuthenticated = true;
			state.isLoading = false;
			state.isLoaded = true;
			state.error = {
				isError: false,
				message: null,
			};
			state.user = payload.user;
			state.error = {
				isError: false,
				message: null,
			};
		},
	},
});

const { error, logout, request, success } = authSlice.actions;

/**
 * @description - To Register an user
 * @param - type - auth action type
 * @param - { username, email, password, name }
 * @param - successCb - function to run on successful request completion
 */
function getAuthAction(
	type: 'register',
	data: Pick<IAuthModalState, 'username' | 'email' | 'password' | 'name'>,
	successCb: () => void
): AsyncThunk<void, never, Record<string, never>>;
/**
 * @description - To Login an user
 * @param - type - auth action type
 * @param - { username, password }
 * @param - successCb - function to run on successful request completion
 */
function getAuthAction(
	type: 'login',
	data: Pick<IAuthModalState, 'username' | 'password'>,
	successCb: () => void
): AsyncThunk<void, never, Record<string, never>>;
/**
 * @description - Get an auth action based on the type
 */
function getAuthAction<T extends IAuthModalState>(
	type: 'login' | 'register',
	data: T,
	successCb: () => void
): AsyncThunk<void, never, Record<string, never>> {
	return createAsyncThunk(`auth/${type}User`, async (_, { dispatch }) => {
		const body = JSON.stringify(data);
		const config: AxiosRequestConfig = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			dispatch(request());
			const { data }: { data: IAuthResponse } = await axios.post(
				`${SERVER_URI}/auth/${type}`,
				body,
				config
			);

			successCb();
			dispatch(success(data));
		} catch (err) {
			const msg: string | string[] = err.response
				? err.response.data.message
				: err.message;
			dispatch(error(msg));
		}
	});
}

export function getAuthState(state: IGlobalState): IAuthState {
	return state.auth;
}

export { error, logout, request, success, getAuthAction, loaduser };

export const authReducer = authSlice.reducer;

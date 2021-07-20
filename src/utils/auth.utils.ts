import axios from 'axios';
import { loaduser } from '../redux/auth/slice';
import { store } from '../redux/store';
import { ILocalStorage } from '../types/auth.types';

class AuthUtils {
	static setLocalStorage<T extends keyof ILocalStorage>(
		key: T,
		value: ILocalStorage[T]
	): void {
		if (process.browser) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}

	static getLocalStorage<T extends keyof ILocalStorage>(
		key: T
	): ILocalStorage[T] | null {
		if (process.browser) {
			const value = localStorage.getItem(key);

			if (value) {
				return JSON.parse(value);
			}
		}

		return null;
	}

	static removeLocalStorage<T extends keyof ILocalStorage>(key: T): void {
		if (process.browser) {
			localStorage.removeItem(key);
		}
	}

	static setAuthToken(): void {
		const token = this.getLocalStorage('auth_details')?.access_token;

		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		} else {
			delete axios.defaults.headers.common['Authorization'];
		}
	}

	static authorize(_store: typeof store): void {
		_store.dispatch(loaduser());
	}
}

export default AuthUtils;

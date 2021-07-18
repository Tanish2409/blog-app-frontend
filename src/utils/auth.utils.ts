import axios from 'axios';
import { ILocalStorage } from '../types/auth.types';

class AuthUtils {
	static setLocalStorage<T extends keyof ILocalStorage>(
		key: string,
		value: ILocalStorage[T]
	): void {
		if (process.browser) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}

	static getLocalStorage<T extends keyof ILocalStorage>(
		key: T
	): ILocalStorage[T] {
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
}

export default AuthUtils;

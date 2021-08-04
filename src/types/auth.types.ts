import { ChangeEvent, FormEvent } from 'react';

export type IAuthState = {
	access_token: string | undefined | null;
	user: IApiUser | undefined | null;
	isAuthenticated: boolean;
	error: {
		isError: boolean;
		message: string | string[] | null;
	};
	isLoading: boolean;
	isLoaded: boolean;
};

export type ConcreteFields<T> = { [P in keyof T]-?: T[P] };
export type StringFields<T> = {
	[P in keyof ConcreteFields<T>]: ConcreteFields<T>[P] extends string
		? P
		: never;
}[keyof T];

export type IFormField = {
	id: StringFields<IAuthModalState>;
	type: string;
	placeholder: string;
};

export type IAuthModalState = {
	email: string;
	password: string;
	name: string;
	username: string;
	authType: 'login' | 'register';
};

export type IAuthModalProps = Pick<IAuthModalState, 'authType'> & {
	handleClose: () => void;
};

export type handleInputChange = {
	(event: ChangeEvent<HTMLInputElement>): void;
};

export type handleFormSubmit = {
	(event: FormEvent<HTMLFormElement>): void;
};

export type FormFieldComponentProps = {
	formField: IFormField;
	formState: IAuthModalState;
	handleChange: handleInputChange;
};

export type IApiUser = {
	_v: string;
	_id: string;
	name: string;
	username: string;
	role: 'admin' | 'user';
	email: string;
	createdAt: string;
	profile?: string;
	about?: string;
	profilePic?: string;
};

export type IAuthResponse = {
	access_token: string;
	user: IApiUser;
};

export type ILocalStorage = {
	auth_details: IAuthResponse;
};

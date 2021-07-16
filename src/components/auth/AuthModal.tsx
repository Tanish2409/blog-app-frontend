// import {} from 'react-dom';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { ShieldCheckIcon, XIcon } from '@heroicons/react/outline';

interface IFormField {
	id: string;
	type: string;
	placeholder: string;
}

export interface IAuthFormState {
	email?: string;
	password: string;
	name?: string;
	username: string;
	isSubmitting: boolean;
	submitted: boolean;
	error: {
		isError: boolean;
		message: string | string[];
	};
	authType: 'login' | 'register';
}

export interface IAuthModalProps extends Pick<IAuthFormState, 'authType'> {
	handleClose: () => void;
}

export type handleInputChange = {
	(event: ChangeEvent<HTMLInputElement>): void;
};

export type handleFormSubmit = {
	(event: FormEvent<HTMLFormElement>): void;
};

const authForm = {
	loginFormFields: [
		{
			id: 'username',
			type: 'text',
			placeholder: 'Username',
		},
		{
			id: 'password',
			type: 'password',
			placeholder: 'Password',
		},
	],
	registerFormFields: [
		{
			id: 'name',
			type: 'text',
			placeholder: 'Full Name',
		},
		{
			id: 'username',
			type: 'text',
			placeholder: 'Username',
		},
		{
			id: 'email',
			type: 'email',
			placeholder: 'Email',
		},
		{
			id: 'password',
			type: 'password',
			placeholder: 'Password',
		},
	],
};

const AuthModal: FC<IAuthModalProps> = ({ authType, handleClose }) => {
	const [formState, setFormState] = useState<IAuthFormState>({
		name: '',
		username: '',
		email: '',
		password: '',
		isSubmitting: false,
		submitted: false,
		error: {
			isError: false,
			message: null,
		},
		authType,
	});

	const handleChange: handleInputChange = (event) => {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit: handleFormSubmit = async (event) => {
		event.preventDefault();

		setFormState({
			...formState,
			isSubmitting: true,
			error: {
				isError: false,
				message: null,
			},
		});

		try {
			const { name, password, username, email } = formState;

			await axios.post(
				`${process.env.NEXT_PUBLIC_API}/auth/${formState.authType}`,
				{ name, password, username, email }
			);

			setFormState({
				...formState,
				name: '',
				email: '',
				username: '',
				password: '',
				isSubmitting: false,
				submitted: true,
				error: {
					isError: false,
					message: null,
				},
			});

			setTimeout(handleClose, 500);
		} catch (error) {
			setFormState({
				...formState,
				isSubmitting: false,
				error: {
					isError: true,
					message: error.response.data.message,
				},
			});
		}
	};

	const changeAuthType = (): void => {
		setFormState({
			...formState,
			error: {
				isError: false,
				message: null,
			},
			authType: formState.authType === 'register' ? 'login' : 'register',
		});
	};

	return createPortal(
		<div className='fixed w-screen h-screen top-0 left-0 bg-black bg-opacity-30'>
			{/* Modal */}
			<div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white shadow-2xl p-7 w-[85%] max-w-xl rounded-xl transition-all'>
				{/* Modal Close Icon */}
				<XIcon
					className={`absolute top-8 right-7 w-6 text-gray-500 cursor-pointer
					${formState.isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
					onClick={formState.isSubmitting ? null : handleClose}
				/>

				<h3 className='font-semibold text-primary tracking-wider typo-h2 uppercase mb-4'>
					{formState.authType}
				</h3>

				<form
					className='space-y-3 md:space-y-5 flex flex-col'
					onSubmit={handleSubmit}
				>
					{authForm[`${formState.authType}FormFields`].map(
						(formField: IFormField) => {
							return (
								<FormFieldComponent
									key={formField.id}
									formField={formField}
									formState={formState}
									handleChange={handleChange}
								/>
							);
						}
					)}

					<button
						disabled={formState.isSubmitting}
						type='submit'
						className={`typo-text w-full bg-primary text-white py-4 rounded-xl uppercase font-bold tracking-widest disabled:bg-gray-400 disabled:cursor-not-allowed ${
							formState.submitted ? 'bg-green-600' : ''
						}`}
					>
						{formState.submitted ? (
							<ShieldCheckIcon className='w-8 mx-auto' />
						) : formState.isSubmitting ? (
							'submitting'
						) : (
							'submit'
						)}
					</button>
				</form>

				<hr className='w-full bg-gray-400 h-[2px] my-4' />

				<div className='text-center typo-sub-text'>
					<p>
						{formState.authType === 'register'
							? 'Already have an account?'
							: "Dont't have an account?"}

						<span
							className={`text-secondary ml-2 cursor-pointer ${
								formState.isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'
							} `}
							onClick={formState.isSubmitting ? null : changeAuthType}
						>
							{formState.authType === 'register' ? 'Login' : 'Register'}
						</span>
					</p>
				</div>

				{formState.error.isError && <ErrorComponent formState={formState} />}
			</div>
		</div>,
		document.getElementById('modal')
	);
};

type FormFieldComponentProps = {
	formField: IFormField;
	formState: IAuthFormState;
	handleChange: handleInputChange;
};

const FormFieldComponent: FC<FormFieldComponentProps> = ({
	formField,
	formState,
	handleChange,
}) => (
	<>
		<label htmlFor={formField.id} className='typo-text text-gray-500 mb-1'>
			{formField.placeholder}
		</label>
		<input
			value={formState[formField.id]}
			type={formField.type}
			name={formField.id}
			id={formField.id}
			placeholder={formField.placeholder}
			className='!m-0 rounded-lg border-gray-300 focus:border-primary focus:ring-primary w-full caret-primary typo-sub-text placeholder-gray-300'
			onChange={handleChange}
		/>
	</>
);

const ErrorComponent: FC<{
	formState: IAuthFormState;
}> = ({ formState }) => {
	return (
		<div className='space-y-2 mt-5 bg-red-500 p-4 rounded-xl'>
			{typeof formState.error.message === 'object' ? (
				formState.error.message.map((mssg, idx) => (
					<p
						key={idx}
						className='typo-sub-text first-letter:uppercase relative before:absolute before:w-2 before:h-2 text-white'
					>
						&bull; {mssg}
					</p>
				))
			) : (
				<p className='typo-sub-text text-white'>
					&bull; {formState.error.message}
				</p>
			)}
		</div>
	);
};

export default AuthModal;

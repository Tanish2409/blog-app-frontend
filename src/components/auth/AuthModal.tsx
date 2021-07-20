import { createPortal } from 'react-dom';
import { FC, useState } from 'react';
import { ShieldCheckIcon, XIcon } from '@heroicons/react/outline';
import {
	FormFieldComponentProps,
	handleFormSubmit,
	handleInputChange,
	IAuthModalState,
	IAuthModalProps,
	IFormField,
	IAuthState,
} from '../../types/auth.types';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthAction, getAuthState } from '../../redux/auth/slice';

const authForm: Record<`${IAuthModalState['authType']}`, IFormField[]> = {
	login: [
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
	register: [
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
	const [formState, setFormState] = useState<IAuthModalState>({
		name: '',
		username: '',
		email: '',
		password: '',
		authType,
	});
	const dispatch = useDispatch();
	const authState = useSelector(getAuthState);

	const handleChange: handleInputChange = (event) => {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	};

	const successCb = (): void => {
		setFormState({
			...formState,
			name: '',
			email: '',
			username: '',
			password: '',
		});

		setTimeout(handleClose, 500);
	};

	const handleSubmit: handleFormSubmit = async (event) => {
		event.preventDefault();

		const { name, password, username, email } = formState;

		if (formState.authType === 'login') {
			const loginAction = getAuthAction(
				'login',
				{ password, username },
				successCb
			);
			dispatch(loginAction());
		} else if (formState.authType === 'register') {
			const registerAction = getAuthAction(
				'register',
				{
					email,
					name,
					password,
					username,
				},
				successCb
			);

			dispatch(registerAction());
		}
	};

	const changeAuthType = (): void => {
		setFormState({
			...formState,
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
					${authState.isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
					onClick={() => (authState.isLoading ? null : handleClose())}
				/>

				<h3 className='font-semibold text-primary tracking-wider typo-h2 uppercase mb-4'>
					{formState.authType}
				</h3>

				<form
					className='space-y-3 md:space-y-5 flex flex-col'
					onSubmit={handleSubmit}
				>
					{authForm[formState.authType].map((formField: IFormField) => {
						return (
							<FormFieldComponent
								key={formField.id}
								formField={formField}
								formState={formState}
								handleChange={handleChange}
							/>
						);
					})}

					<button
						disabled={authState.isLoading}
						type='submit'
						className={`typo-text w-full bg-primary text-white py-4 rounded-xl uppercase font-bold tracking-widest disabled:bg-gray-400 disabled:cursor-not-allowed ${
							authState.isLoaded && !authState.error.isError
								? 'bg-green-600'
								: ''
						}`}
					>
						{authState.isLoaded && !authState.error.isError ? (
							<ShieldCheckIcon className='w-8 mx-auto' />
						) : authState.isLoading ? (
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
								authState.isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
							} `}
							onClick={() => (authState.isLoading ? null : changeAuthType())}
						>
							{formState.authType === 'register' ? 'Login' : 'Register'}
						</span>
					</p>
				</div>

				{authState.error.isError && authState.error.message && (
					<ErrorComponent authState={authState} />
				)}
			</div>
		</div>,
		document.getElementById('modal') as HTMLElement
	);
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
	authState: IAuthState;
}> = ({ authState }) => {
	return (
		<div className='space-y-2 mt-5 bg-red-500 p-4 rounded-xl'>
			{authState.error.message &&
			typeof authState.error.message === 'object' ? (
				authState.error.message.map((mssg, idx) => (
					<p
						key={idx}
						className='typo-sub-text first-letter:uppercase relative before:absolute before:w-2 before:h-2 text-white'
					>
						&bull; {mssg}
					</p>
				))
			) : (
				<p className='typo-sub-text text-white'>
					&bull; {authState.error.message}
				</p>
			)}
		</div>
	);
};

export default AuthModal;

import { FC, useState } from 'react';
import {
	MenuAlt3Icon,
	XIcon,
	UserAddIcon,
	LoginIcon,
	LogoutIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import AuthModal from './auth/AuthModal';
import { IAuthModalProps } from '@customTypes/auth.types';
import AuthUtils from '@utils/auth.utils';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthState, logout } from '@reduxActions/auth/slice';

const Header: FC = () => {
	const [open, setOpen] = useState(false);

	const dispatch = useDispatch();
	const authState = useSelector(getAuthState);

	const [authModal, setAuthModal] = useState<{
		isOpen: boolean;
		type: IAuthModalProps['authType'];
	}>({
		isOpen: false,
		type: 'register',
	});

	// toggle opening of side nav
	const toggle = (): void => {
		setOpen(!open);
	};

	const openAuthModal = (type: IAuthModalProps['authType']): void => {
		setAuthModal({
			type,
			isOpen: true,
		});
	};

	const closeAuthModal = (): void => {
		setAuthModal({
			...authModal,
			isOpen: false,
		});
	};

	return (
		<nav className='w-full min-h-[60px] flex items-center justify-between bg-primary shadow-lg text-white px-4 md:px-6 md:py-4 lg:px-8 lg:py-6'>
			{authModal.isOpen ? (
				<AuthModal authType={authModal.type} handleClose={closeAuthModal} />
			) : null}

			{/* Brand Name */}
			<Link href='/'>
				<a>
					<h1 className='typo-h1 font-bold'>Blog App</h1>
				</a>
			</Link>

			{/* Menu Icon for small screens */}
			<div className='w-6 h-6 lg:hidden cursor-pointer'>
				<MenuAlt3Icon onClick={toggle} />
			</div>

			{/* Side Menu for small screens */}
			{open && (
				<div className='absolute right-0 top-0 h-full min-w-[200px] bg-gray-100/70 backdrop-blur-sm text-gray-800 pt-16 px-4 shadow-2xl'>
					<XIcon
						className='w-6 h-6 absolute top-4 right-4 cursor-pointer'
						onClick={toggle}
					/>
					<ul className='space-y-4'>
						{authState.isAuthenticated ? (
							<li className='flex space-x-3'>
								<LogoutIcon className='w-6 h-6' />
								<p
									className='typo-text cursor-pointer'
									onClick={() => {
										AuthUtils.removeLocalStorage('auth_details');
										setOpen(false);
										dispatch(logout());
									}}
								>
									Logout
								</p>
							</li>
						) : (
							<>
								<li className='flex space-x-3'>
									<UserAddIcon className='w-6 h-6' />
									<p
										className='typo-text cursor-pointer'
										onClick={() => {
											openAuthModal('register');
											setOpen(false);
										}}
									>
										Register
									</p>
								</li>
								<li className='flex space-x-3'>
									<LoginIcon className='w-6 h-6' />
									<p
										className='typo-text cursor-pointer'
										onClick={() => {
											openAuthModal('login');
											setOpen(false);
										}}
									>
										Login
									</p>
								</li>
							</>
						)}
					</ul>
				</div>
			)}

			{/* Menu for large screens */}
			<div className='space-x-6 hidden lg:block'>
				{authState.isAuthenticated ? (
					<button
						className='px-6 py-2 bg-white text-primary rounded-lg font-medium typo-text'
						onClick={() => {
							dispatch(logout());
						}}
					>
						Logout
					</button>
				) : (
					<>
						<button
							className='px-6 py-2 bg-white text-primary rounded-lg font-medium typo-text'
							onClick={() => openAuthModal('register')}
						>
							Register
						</button>
						<button
							className='font-medium typo-text'
							onClick={() => openAuthModal('login')}
						>
							Login
						</button>
					</>
				)}
			</div>
		</nav>
	);
};

export default Header;

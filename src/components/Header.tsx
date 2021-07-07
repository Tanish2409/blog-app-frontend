import { FC, useState } from 'react';
import {
	MenuAlt3Icon,
	XIcon,
	UserAddIcon,
	LoginIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';

const Header: FC = () => {
	const [open, setOpen] = useState(false);

	// toggle opening of side nav
	const toggle = (): void => {
		setOpen(!open);
	};

	return (
		<nav className='w-full min-h-[60px] flex items-center justify-between bg-green-500 shadow-lg text-white px-4 md:px-6 md:py-4 lg:px-8 lg:py-6'>
			{/* Brand Name */}
			<Link href='/'>
				<a>
					<h1 className='text-xl md:text-2xl xl:text-3xl font-bold'>
						Blog App
					</h1>
				</a>
			</Link>

			{/* Menu Icon for small screens */}
			<div className='w-6 h-6 lg:hidden'>
				<MenuAlt3Icon onClick={toggle} />
			</div>

			{/* Side Menu for small screens */}
			{open && (
				<div className='absolute right-0 top-0 h-full min-w-[200px] bg-gray-100/70 backdrop-blur-sm text-gray-800 pt-16 px-4 shadow-2xl'>
					<XIcon className='w-6 h-6 absolute top-4 right-4' onClick={toggle} />
					<ul className='space-y-4'>
						<li className='flex space-x-3'>
							<UserAddIcon className='w-6 h-6' />
							<p>Sign Up</p>
						</li>
						<li className='flex space-x-3'>
							<LoginIcon className='w-6 h-6' />
							<p>Sign In</p>
						</li>
					</ul>
				</div>
			)}

			{/* Menu for large screens */}
			<div className='space-x-6 hidden lg:block'>
				<button className='px-6 py-2 bg-white text-green-500 rounded-lg font-medium text-lg'>
					Sign Up
				</button>
				<button className='font-medium text-lg'>Sign In</button>
			</div>
		</nav>
	);
};

export default Header;

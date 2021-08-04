import { getAuthState } from '@reduxActions/auth/slice';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AdminProtected: FC = ({ children }) => {
	const authState = useSelector(getAuthState);
	const router = useRouter();
	useEffect(() => {
		if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
			// TODO : Add alert for unauthorized when Alert State in redux is initialized
			router.replace('/');
		}
	});
	return <>{children}</>;
};

export default AdminProtected;

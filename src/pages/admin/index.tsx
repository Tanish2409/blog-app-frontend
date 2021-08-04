import AdminProtected from '@components/auth/AdminProtected';
import { FC } from 'react';

const AdminDashboard: FC = () => {
	return (
		<AdminProtected>
			<div>
				<h1>Admin Dashboard</h1>
			</div>
		</AdminProtected>
	);
};

export default AdminDashboard;

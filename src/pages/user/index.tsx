import PrivateProtected from '@components/auth/PrivateProtected';
import { FC } from 'react';

const UserDashboard: FC = () => {
	return (
		<PrivateProtected>
			<div>
				<h1>User Dashboard</h1>
			</div>
		</PrivateProtected>
	);
};

export default UserDashboard;

import Header from './Header';
import { FC } from 'react';

const Layout: FC = ({ children }) => {
	return (
		<>
			<Header />
			{children}
			Footer
		</>
	);
};

export default Layout;

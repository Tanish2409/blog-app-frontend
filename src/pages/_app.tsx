import Head from 'next/head';
import { AppProps } from 'next/app';
import { FC } from 'react';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<Provider store={store}>
			<Head>
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
			</Head>
			<Layout>
				<Component {...pageProps} />;
			</Layout>
		</Provider>
	);
};

export default MyApp;

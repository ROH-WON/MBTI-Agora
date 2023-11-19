import { QueryClient, QueryClientProvider } from 'react-query';
import Router from './routes/Router';
import { useLocation } from 'react-router-dom';
import Layout from './components/Global/Layout/Layout';
import { Toaster } from 'react-hot-toast';
import { Tooltip } from 'react-tooltip'

const queryClient = new QueryClient();

const App = () => {
	const location = useLocation();
	const currentPath = location.pathname;
	const shouldRenderMarginTop = !['/', '/login', '/register'].includes(
		currentPath,
	);

	return (
		<QueryClientProvider client={queryClient}>
			<div className="h-screen">
				<Layout>
					<div
						className={
							shouldRenderMarginTop
								? 'mt-5 mb-20 mx-4 sm:mx-10 md:mx-20 lg:mx-40'
								: ''
						}
					>
						<Router />
						<Tooltip id="tooltip" />
						<Toaster />
					</div>
				</Layout>
			</div>
		</QueryClientProvider>
	);
};

export default App;

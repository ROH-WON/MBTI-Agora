import Footer from './Footer';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
	const excludedPaths = ['/login', '/register'];
	const location = useLocation();
	const currentPath = location.pathname;

	const renderContent = () => {
		if (excludedPaths.includes(currentPath)) {
			return children;
		} else {
			return (
				<div className="relative min-h-screen">
					<Header />
					{children}
					<Footer />
				</div>
			);
		}
	};

	return <>{renderContent()}</>;
};

Layout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Layout;

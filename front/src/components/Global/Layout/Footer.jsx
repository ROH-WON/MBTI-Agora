const Footer = () => {
	return (
		<>
			<footer className="bg-blue-400">
				<div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
					<div className="sm:flex sm:items-center sm:justify-between">
						<a className="flex items-center mb-4 sm:mb-0">
							<span className="text-white self-center text-2xl font-semibold whitespace-nowrap">
								<img
									className="self-end w-46 h-16 object-cover"
									src="/images/logo1.png"
								/>
							</span>
						</a>
						<span className="text-white text-sm text-gray-500 sm:text-center">
							© 2023 DAMCHAE™ . All Rights Reserved.
						</span>
					</div>
				</div>
			</footer>
		</>
	);
};

export default Footer;

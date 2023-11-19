import banner1 from '/images/banner1.png';
import banner2 from '/images/banner2.png';
import banner3 from '/images/banner3.png';
import banner4 from '/images/banner4.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';

const BannerCarousel = () => {
	return (
		<Swiper
			navigation={true}
			loop={true}
			modules={[Autoplay, Navigation]}
			className="mySwiper max-w-6xl"
			autoplay={{
				delay: 5000,
				disableOnInteraction: false,
			}}
		>
			<SwiperSlide>
				<img src={banner1} />
			</SwiperSlide>
			<SwiperSlide>
				{' '}
				<img src={banner2} />
			</SwiperSlide>
			<SwiperSlide>
				{' '}
				<img src={banner3} />
			</SwiperSlide>
			<SwiperSlide>
				{' '}
				<img src={banner4} />
			</SwiperSlide>
		</Swiper>
	);
};

export default BannerCarousel;

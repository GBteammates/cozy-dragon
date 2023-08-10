import { Box, IconButton, Image } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';
import Slider from 'react-slick';

interface CarouselProps {
    images: string[];
}

const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const Carousel = ({images}: CarouselProps) => {
    const [slider, setSlider] = React.useState<Slider | null>(null);

    return (
        <Box
            position='relative'
            height='auto'
            width='full'
            overflow='hidden'>
            <IconButton
                aria-label='left-arrow'
                color='white'
                boxShadow={'0 4px 12px #8e8f935e'}
                borderRadius='full'
                position='absolute'
                size='lg'
                left='8px'
                top='50%'
                transform={'translate(0%, -50%)'}
                zIndex={2}
                hidden={images.length <= 1}
                onClick={() => slider?.slickPrev()}>
                <MdOutlineArrowBackIosNew color='black'/>
            </IconButton>
            <IconButton
                aria-label='right-arrow'
                color='white'
                boxShadow={'0 4px 12px #8e8f935e'}
                borderRadius='full'
                position='absolute'
                size='lg'
                right='8px'
                top='50%'
                transform={'translate(0%, -50%)'}
                zIndex={2}
                hidden={images.length <= 1}
                onClick={() => slider?.slickNext()}>
                <MdOutlineArrowForwardIos color='black'/>
            </IconButton>
            <Slider {...settings} ref={(slider: any) => setSlider(slider)}>
                {images.map((url, index) => (
                    <Image
                        key={index}
                        maxH='500px'
                        maxW='100%'
                        minH='auto'
                        minW='500px'
                        objectFit={'contain'}
                        src={url}
                        fallbackSrc={'/assets/images/placeholder-image.jpg'}
                    />
                ))}
            </Slider>
        </Box>
    );
};

export default Carousel;
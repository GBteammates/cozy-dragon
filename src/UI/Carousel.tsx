import {Box, IconButton, Image} from '@chakra-ui/react';
import React from 'react';
import {BiLeftArrowAlt, BiRightArrowAlt} from 'react-icons/bi';
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
                aria-label="left-arrow"
                colorScheme="gray"
                borderRadius="full"
                border='1px solid'
                borderColor='gray.200'
                position="absolute"
                size='lg'
                left='10px'
                top='50%'
                transform={'translate(0%, -50%)'}
                zIndex={2}
                hidden={images.length <=1}
                onClick={() => slider?.slickPrev()}>
                <BiLeftArrowAlt/>
            </IconButton>
            <IconButton
                aria-label="right-arrow"
                colorScheme="gray"
                borderRadius="full"
                border='1px solid'
                borderColor='gray.200'
                position="absolute"
                size='lg'
                right='10px'
                top='50%'
                transform={'translate(0%, -50%)'}
                zIndex={2}
                hidden={images.length <=1}
                onClick={() => slider?.slickNext()}>
                <BiRightArrowAlt/>
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
                        fallbackSrc={'/imgs/placeholder-image.jpg'}
                    />
                ))}
            </Slider>
        </Box>
    );
};

export default Carousel;
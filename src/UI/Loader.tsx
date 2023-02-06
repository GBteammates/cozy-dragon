import {Center, Spinner} from '@chakra-ui/react';
import React from 'react';

const Loader = () => {
    return (
        <Center h='50vh'>
            <Spinner
                thickness='6px'
                speed='0.65s'
                emptyColor='gray.200'
                color='gray.400'
                size='xl'
            />
        </Center>
    );
};

export default Loader;
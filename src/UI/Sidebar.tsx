import React, { FC, PropsWithChildren } from 'react';
import { Box } from '@chakra-ui/react';

const Sidebar: FC<PropsWithChildren<{}>> = ({children}) => {
    return (
        <Box
            bg='white'
            borderRight='1px'
            position='sticky'
            top='80px'
            py={4}
            height='calc(100vh - 80px)'
            borderRightColor='gray.200'
            overflowY='auto'>
            {children}
        </Box>
    );
};

export default Sidebar;
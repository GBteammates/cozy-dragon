import { Box, createStandaloneToast } from '@chakra-ui/react';
import React, { FC, PropsWithChildren } from 'react';
import Footer from '../components/footer/Footer';
import { Header } from '../components/header/Header';

export const Layout: FC<PropsWithChildren<{}>> = ({children}) => {
    const {ToastContainer} = createStandaloneToast();
    return (
        <Box bg='gray.50'>
            <Header/>
            <main style={{minHeight: 'calc(100vh - 80px - 61px)'}}>
                {children}
            </main>
            <Footer/>
            <ToastContainer/>
        </Box>
    )
}
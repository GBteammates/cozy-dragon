import React, {ReactNode} from 'react';
import {GoBackLink} from "./GoBackLink";
import {Flex, Heading} from "@chakra-ui/react";

interface MainBlockLayoutProps {
    title?: string,
    link?: string,
    linkTitle?: string,
    children: ReactNode
}

const MainBlockLayout = ({title, link, linkTitle, children}: MainBlockLayoutProps) => {
    return (
        <Flex flexDirection='column' flex={1} mx='auto' w='70%' maxW='1200px' minW='920px' p={5}>
            <GoBackLink link={link} linkTitle={linkTitle}/>
            {title && <Heading my={5}>{title}</Heading>}
            {children}
        </Flex>
    );
};

export default MainBlockLayout;
import {Flex, FlexProps} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps extends FlexProps {
    children: string;
}

export const NavItem = ({children, ...rest}: NavItemProps) => {
    return (
        <Link to={`/${children?.toLowerCase()}`} style={{textDecoration: 'none', flex: 1}}>
            <Flex
                align='center'
                p={4}
                role='group'
                cursor='pointer'
                color='gray.600'
                _hover={{
                    bg: 'gray.400',
                    color: 'white',
                }}
                {...rest}>
                {children}
            </Flex>
        </Link>
    );
};
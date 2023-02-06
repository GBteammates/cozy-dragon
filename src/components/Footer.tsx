import {
    Box,
    Text,
    Flex,
} from '@chakra-ui/react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            bg='gray.200'
            color='gray.700'>
            <Box py={5}>
                <Flex
                    align={'center'}
                    _before={{
                        content: '""',
                        borderBottom: '1px solid',
                        borderColor: 'gray.300',
                        flexGrow: 1,
                        mr: 8,
                    }}
                    _after={{
                        content: '""',
                        borderBottom: '1px solid',
                        borderColor: 'gray.300',
                        flexGrow: 1,
                        ml: 8,
                    }}>
                    <Text fontSize={'sm'} textAlign={'center'} color='gray'>
                        © {currentYear} Cozy Dragon. All rights reserved
                    </Text>
                </Flex>
            </Box>
        </Box>
    );
}
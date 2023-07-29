import { Box, Button, Flex, Heading, HStack, Icon, Image, List, ListItem, Text } from '@chakra-ui/react';
import React from 'react';
import { useCart } from "../../context/CartContext";
import { toCurrency } from "../../utilities/formatCurrency";
import { Link } from "react-router-dom";
import Counter from "../../UI/Counter";
import { BsBag } from "react-icons/bs";
import { slashEscape } from "../../utilities/RegExpURL";
import { useTranslation } from 'react-i18next';

const CartSidebar = () => {
    const {t} = useTranslation();
    const {cart, getTotalCost} = useCart();

    const CartList = () => (
        <>
            {cart?.items?.length > 0
                ? <List flexGrow={1} spacing={1} overflowY='auto' py={5} pr={1}>
                    {cart?.items.map(({item, quantity}) => (
                        <ListItem key={item?.id}>
                            <HStack spacing={3}>
                                <Link to={`/${slashEscape(item.category?.name)}/${item?.id}`}
                                      style={{display: 'flex', alignItems: 'center', flex: 1}}>
                                    <Flex maxH='100px'
                                          maxW='100px'
                                          justifyContent='center'
                                          p={1}
                                          mr={2}
                                    >
                                        <Image
                                            maxH='100%'
                                            maxW='100%'
                                            minH='100px'
                                            minW='100px'
                                            objectFit={'contain'}
                                            src={item?.image[0] ?? '/imgs/placeholder-image.jpg'}
                                        />
                                    </Flex>
                                    <Flex gap={2} flexDirection='column'>
                                        <Text fontSize='sm' noOfLines={3}>{item?.title}</Text>
                                        <Text fontSize='sm'
                                              color='gray.500'>{toCurrency(item?.price)}</Text>
                                    </Flex>
                                </Link>
                                <Counter product={item} quantity={quantity}/>
                            </HStack>
                        </ListItem>
                    ))}
                </List>
                :
                <Flex flex={1} flexDirection='column' alignItems='center' justifyContent='center'>
                    <Icon fontSize='100px' color='gray.400' as={BsBag}/>
                    <Heading fontSize='large' mt={6} mb={3}>{t('Your bag is empty')}</Heading>
                    <Text>{t('The items you order will be displayed here')}</Text>
                </Flex>
            }
        </>
    );

    const CartLink = () => (
        <>
            {cart?.items?.length > 0 &&
                <Link to={'/cart'}>
                    <Button
                        fontWeight='normal'
                        colorScheme='yellow'
                        justifyContent='space-between'
                        py={6}
                        mt={4}
                        borderRadius='2xl'
                        w='100%'
                    >
                        {t('View bag')}
                        <Text as={"span"} fontSize='xl' ml={2} fontWeight='bold'>
                            {toCurrency(getTotalCost(cart.items))}
                        </Text>
                    </Button>
                </Link>
            }
        </>
    )

    return (
        <Flex
            textAlign={"left"}
            position={"sticky"}
            top='80px'
            padding={4}
            height='calc(100vh - 80px)'
            overflow='hidden'
            flexDirection='column'
            bg='gray.100'
            borderLeft="1px"
            borderLeftColor='gray.200'
        >
            <Heading fontSize='x-large'>{t('My bag')}</Heading>
            <CartList/>
            {cart?.items?.length > 0 &&
                <Box borderTop='1px solid' borderColor='gray.300' pt={3} pr={3} color='gray' fontSize='sm'
                     textAlign='right'>
                    <Text>{t('Free shipping')}</Text>
                </Box>}
            <CartLink/>
        </Flex>

    );
};

export default CartSidebar;
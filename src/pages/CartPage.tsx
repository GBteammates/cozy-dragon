import React, { memo, useEffect, useMemo } from 'react';
import {useCart} from "../context/CartContext";
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    Image,
    List,
    ListItem,
    Spacer,
    Text
} from "@chakra-ui/react";
import {toCurrency} from "../utilities/formatCurrency";
import {Link, useNavigate} from 'react-router-dom';
import {BsBag} from 'react-icons/bs';
import Counter from "../UI/Counter";
import {useCategory} from '../context/CategoryContext';
import MainBlockLayout from '../UI/MainBlockLayout';
import {OrderForm} from '../components/cart/OrderForm';
import {slashEscape} from "../utilities/RegExpURL";
import {IOrder} from "../models/IOrder";
import {getHeaderConfig} from "../utilities/getHeaderConfig";
import {getCartId, setCartId} from "../utilities/local-storage-handling";
import {ToastError, ToastSuccess} from "../utilities/error-handling";
import OrderService from "../api/OrderService";
import TotalCostTable from '../UI/TotalCostTable';
import Loader from "../UI/Loader";
import { useTranslation } from 'react-i18next';

export const CartPage = memo(() => {
    const {t} = useTranslation();
    const {cart, getTotalQuantity, onEmptyCartContext, onFetchCart, isLoadingCart} = useCart();
    const {currentCategory} = useCategory();
    const navigate = useNavigate();

    useEffect(() => {
        const cartId = getCartId();
        if (cartId) {
            onFetchCart(cartId);
        }
    }, []);

    const handleFormSubmit = async (order: IOrder) => {
        try {
            const config = getHeaderConfig();
            const {data} = await OrderService.createOrder(order, config);
            setCartId(data.newCartId);
            onEmptyCartContext();
            ToastSuccess(
                t('Thank you for the order. You can track the status of your order in the My Orders section.')
            );
        } catch (error: any) {
            ToastError(t('Failed to submit order. Please try again later.'));
        } finally {
            navigate('/orders');
        }
    }

    const EmptyCart = () => (
        <Flex flexDirection='column' alignItems='center' gap={4} mt={10}>
            <Icon fontSize='140px' color='gray.400' as={BsBag}/>
            <Heading fontSize='xx-large' my={2}>
                {t('Your bag is empty')}
            </Heading>
            <Text color='gray'>
                {t('You do not have any items in your bag')}
            </Text>
            <HStack mt={10}>
                <Link to={`/${slashEscape(currentCategory?.name) ?? ''}`}>
                    <Button colorScheme='blackAlpha' px={10}>
                        {t('Go to catalog')}
                    </Button>
                </Link>
                <Link to={`/orders`}>
                    <Button colorScheme='yellow' px={10}>
                        {t('My orders')}
                    </Button>
                </Link>
            </HStack>
        </Flex>
    );

    const memorizedOrderList = useMemo(() => (
        <Flex flex={1} overflow='hidden' height='calc(100vh - 300px)' flexDirection='column'>
            <List overflow='auto' spacing={3}>
                {cart?.items?.map(({item, quantity}) => (
                    <ListItem key={item.id} pr={2}>
                        <HStack spacing={3}>
                            <Link to={`/${slashEscape(item.category?.name)}/${item.id}`}
                                  style={{display: "flex", alignItems: 'center'}}>
                                <Flex maxH='110px'
                                      maxW='110px'
                                      justifyContent='center'
                                >
                                    <Image
                                        maxH='100%'
                                        maxW='100%'
                                        minH='110px'
                                        minW='110px'
                                        objectFit={'contain'}
                                        src={item.image[0]}
                                        fallbackSrc='/assets/images/placeholder-image.jpg'
                                    />
                                </Flex>
                                <Flex flexGrow={1} flexDirection='column' px={4}>
                                    <Text fontSize='sm'>{item.title}</Text>
                                    <Text fontSize='sm'
                                          color='gray.500'>{toCurrency(item.price)}</Text>
                                </Flex>
                            </Link>
                            <Spacer/>
                            <Counter product={item} quantity={quantity}/>
                        </HStack>
                    </ListItem>
                ))}
            </List>
            <Text alignSelf='end' color='gray' fontSize='sm' pt={3} pr={3}>
                {t('Total number of goods')}: {getTotalQuantity()}
            </Text>
        </Flex>
    ), [cart?.items]);

    return (
        <MainBlockLayout title={t('My bag')}>
            {isLoadingCart && cart?.items?.length === 0 && <Loader/>}
            {cart?.items?.length > 0 && (
                <Flex gap={10} pt={2}>
                    {memorizedOrderList}
                    <Box flex={1} overflow={"auto"}>
                        <Heading fontSize='x-large' mb={2}>{t('Total')}</Heading>
                        <Text color='gray' borderBottom='1px solid' borderBottomColor='gray.300' pb={2}>
                            {t('Free shipping. Payment upon receipt by card or cash.')}
                        </Text>
                        <TotalCostTable items={cart.items}/>
                        <Heading fontSize='x-large' mb={4}>
                            {t('Delivery address')}
                        </Heading>
                        <OrderForm handleFormSubmit={handleFormSubmit}/>
                    </Box>
                </Flex>)}
            {!isLoadingCart && cart?.items?.length === 0 && <EmptyCart/>}
        </MainBlockLayout>
    );
});
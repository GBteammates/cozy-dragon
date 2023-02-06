import React, {useEffect} from 'react';
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

export const Cart = () => {
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
            ToastSuccess('Спасибо за заказ. На указанный email мы пришлём ссылку на оплату.');
        } catch (error: any) {
            ToastError('Не удалось отправить заказ. Повторите попытку позже.');
        } finally {
            navigate('/orders');
        }
    }

    const EmptyCart = () => (
        <Flex flexDirection='column' alignItems='center' gap={4} mt={10}>
            <Icon fontSize='140px' color='gray.400' as={BsBag}/>
            <Heading fontSize='xx-large' my={2}>В вашей корзине пока пусто</Heading>
            <Text color='gray'>Тут появятся товары, которые вы закажете.</Text>
            <HStack mt={10}>
                <Link to={`/${slashEscape(currentCategory?.name) ?? ''}`}>
                    <Button colorScheme='blackAlpha' px={10}>
                        В каталог
                    </Button>
                </Link>
                <Link to={`/orders`}>
                    <Button colorScheme='yellow' px={10}>
                        Мои заказы
                    </Button>
                </Link>
            </HStack>
        </Flex>
    );

    const OrderList = () => (
        <Flex flex={1} overflow='hidden' height='calc(100vh - 300px)' flexDirection='column'>
            <List overflow='auto' spacing={3}>
                {cart?.items.map(({item, quantity}) => (
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
                                        src={item.image[0] ?? '/imgs/placeholder-image.jpg'}
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
                Общее количество товаров: {getTotalQuantity()}
            </Text>
        </Flex>
    )

    return (
        <MainBlockLayout title={'Корзина'}>
            {isLoadingCart && cart?.items?.length === 0 && <Loader/>}
            {cart?.items?.length > 0 && (
                <Flex gap={10} pt={2}>
                    <OrderList/>
                    <Box flex={1} overflow={"auto"}>
                        <Heading fontSize='x-large' mb={2}>Итого</Heading>
                        <Text color='gray' borderBottom='1px solid' borderBottomColor='gray.300' pb={2}>Бесплатная доставка 30–60 мин. Оплата при получении картой или наличными.</Text>
                        <TotalCostTable items={cart.items}/>
                        <Heading fontSize='x-large' mb={4}>Адрес доставки</Heading>
                        <OrderForm handleFormSubmit={handleFormSubmit}/>
                    </Box>
                </Flex>)}
            {!isLoadingCart && cart?.items?.length === 0 && <EmptyCart/>}
        </MainBlockLayout>
    );
};
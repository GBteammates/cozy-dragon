import React, {useEffect, useState} from 'react';
import {useCategory} from "../context/CategoryContext";
import {Button, Flex, Heading, List} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import MainBlockLayout from "../UI/MainBlockLayout";
import {slashEscape} from "../utilities/RegExpURL";
import {getHeaderConfig} from "../utilities/getHeaderConfig";
import {getUserId} from "../utilities/local-storage-handling";
import {OrderItem} from "../components/order/OrderItem";
import OrderService from "../api/OrderService";
import Loader from '../UI/Loader';
import {useCustomer} from "../context/CustomerContext";
import { ICreatedOrder } from '../models/IOrder';

export const OrderList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [list, setList] = useState([] as ICreatedOrder[]);
    const [error, setError] = useState('');
    const {currentCategory} = useCategory();
    const {customer} = useCustomer();

    useEffect(() => {
        fetchOrders();
    }, [customer]);

    const fetchOrders = async () => {
        try {
            const config = getHeaderConfig();
            const userId = getUserId();
            if (userId) {
                const {data} = await OrderService.getOrders(userId, config);
                setList(data);
            } else {
                 setList([]);
            }
        } catch (error: any) {
            setError('Не удалось загрузить список заказов');
        } finally {
            setIsLoading(false);
        }
    }

    const EmptyList = () => (
        <Flex alignItems='center' justifyContent='center' gap={4} flexDirection='column' mt='100px'>
            <Heading fontSize='x-large' my={2}>Список заказов пуст</Heading>
            <Link to={`/${slashEscape(currentCategory?.name) ?? ''}`}>
                <Button colorScheme='yellow' px={10} mt={6}>
                    В каталог
                </Button>
            </Link>
        </Flex>
    )

    return (
        <MainBlockLayout title={'Мои заказы'}>
            {isLoading && Loader()}
            {!isLoading && list?.length > 0 &&
                <List spacing={4}>
                        {list.map((order, index) => (
                            <OrderItem key={index} order={order}/>
                        ))}
                </List>
            }
            {!isLoading && list.length === 0 &&
                <EmptyList/>
            }
        </MainBlockLayout>
    );
};
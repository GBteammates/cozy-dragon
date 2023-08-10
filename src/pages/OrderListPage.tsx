import React, { memo, useEffect, useState } from 'react';
import { useCategory } from "../context/CategoryContext";
import { Button, Flex, Heading, List } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import MainBlockLayout from "../UI/MainBlockLayout";
import { slashEscape } from "../utilities/RegExpURL";
import { getHeaderConfig } from "../utilities/getHeaderConfig";
import { getUserId } from "../utilities/local-storage-handling";
import { OrderItem } from "../components/order/OrderItem";
import OrderService from "../api/OrderService";
import { useCustomer } from "../context/CustomerContext";
import { ICreatedOrder } from '../models/IOrder';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../UI/ErrorMessage';
import Loader from '../UI/Loader';

export const OrderListPage = memo(() => {
    const {t} = useTranslation();
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
            setError(t('Failed to load order list'));
        } finally {
            setIsLoading(false);
        }
    }

    const EmptyList = () => (
        <Flex alignItems='center' justifyContent='center' gap={4} flexDirection='column' mt='100px'>
            <Heading fontSize='x-large' my={2}>
                {t('Order list is empty')}
            </Heading>
            <Link to={`/${slashEscape(currentCategory?.name) ?? ''}`}>
                <Button colorScheme='yellow' px={10} mt={6}>
                    {t('Go to catalog')}
                </Button>
            </Link>
        </Flex>
    )

    if (isLoading) {
        return (
            <MainBlockLayout title={t('My orders')}>
                <Loader/>
            </MainBlockLayout>
        )
    }

    if (error) {
        return (
            <MainBlockLayout title={t('My orders')}>
                <ErrorMessage message={error} borderRadius='2xl'/>
            </MainBlockLayout>
        )
    }

    return (
        <MainBlockLayout title={t('My orders')}>
            {list.length === 0
                ? <EmptyList/>
                : (
                    <List spacing={4}>
                        {list.map((order) => (
                            <OrderItem key={order.id} order={order}/>
                        ))}
                    </List>
                )}
        </MainBlockLayout>
    );
});
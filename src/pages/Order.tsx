import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Box, Flex, Heading, HStack, IconButton, Image, List, ListItem, Text, useClipboard} from "@chakra-ui/react";
import {getHeaderConfig} from "../utilities/getHeaderConfig";
import OrderService from "../api/OrderService";
import MainBlockLayout from "../UI/MainBlockLayout";
import Loader from "../UI/Loader";
import {toCurrency} from "../utilities/formatCurrency";
import TotalCostTable from "../UI/TotalCostTable";
import moment from "moment";
import OrderStatusBadge from "../UI/OrderStatusBadge";
import { ICreatedOrder } from '../models/IOrder';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';

export const Order = () => {
    const {orderId} = useParams();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<ICreatedOrder>();

    const {hasCopied, setValue, onCopy} = useClipboard('');

    useEffect(() => {
        fetchOrderById();
    }, []);

    const fetchOrderById = async () => {
        try {
            const config = getHeaderConfig();
            if (orderId) {
                const {data} = await OrderService.getOrderById(orderId, config);
                setOrder(data);
                setValue(orderId);
            }
        } catch (error: any) {
            setError('Не удалось загрузить информацию о заказе');
        } finally {
            setIsLoading(false);
        }
    }

    const Title = ({title}: { title: string }) => (
        <Heading size='lg' my={3} py={3} borderBottom='1px solid' borderBottomColor='gray.300'>{title}</Heading>
    )

    const ListOfItems = () => (
        <List flexGrow={1} spacing={3} overflowY='auto' py={5}>
            {order?.items.map(({item, quantity}) => (
                <ListItem key={item?.id}>
                    <HStack spacing={3}>
                        <Flex alignItems='center' flex={1}>
                            <Flex maxH='90px'
                                  maxW='90px'
                                  justifyContent='center'
                                  p={1}
                                  mr={2}
                            >
                                <Image
                                    maxH='100%'
                                    maxW='100%'
                                    minH='90px'
                                    minW='90px'
                                    objectFit={'contain'}
                                    src={item?.image[0] ?? '/imgs/placeholder-image.jpg'}
                                />
                            </Flex>
                            <Flex gap={2} flexDirection='column'>
                                <Text fontSize='md' noOfLines={3}>{item?.title}</Text>
                                <Text fontSize='sm' fontWeight='bold'>{toCurrency(item?.price)}</Text>
                            </Flex>
                        </Flex>
                        <Text textAlign='right' fontSize='lg' fontWeight='bold'>x {quantity}</Text>
                    </HStack>
                </ListItem>
            ))}
        </List>
    )

    return (
        <MainBlockLayout link={`/orders`} linkTitle={'К моим заказам'}>
            {isLoading && <Loader/>}

            {!isLoading && order && <Box w='100%' my={8}>
                <Flex justifyContent='space-between' alignItems='start'>
                    <Box>
                        <Heading>Заказ от {moment(order?.created_at).format('DD MMMM')} </Heading>
                        <Flex gap={2} alignItems='center'>
                            <Text mt={2} color='gray.500' fontSize='lg'>Создан в {moment(order?.created_at).format('LT')} -  №{order?.id}</Text>
                            <IconButton
                                aria-label='Copy link'
                                size='sm'
                                icon={hasCopied ? <CheckIcon color='green'/> : <CopyIcon/>}
                                onClick={onCopy}
                            />
                        </Flex>
                    </Box>
                    <OrderStatusBadge status={order.status}/>
                </Flex>

                <Flex gap='50px'>
                    <Flex flexDirection='column' flexGrow={1} maxW='540px'>
                        <Box>
                            <Title title='Ваш заказ'/>
                            <ListOfItems/>
                        </Box>
                        <Box>
                            <Title title='Детали доставки'/>
                            <Text fontSize='sm' color='gray'>Адрес</Text>
                            <Text>{order.address.zipcode}, {order.address.country}, {order.address.city}, {order.address.street}</Text>

                            <Text fontSize='sm' color='gray' mt={3}>Дата доставки</Text>
                            <Text>{moment(order?.shipment_time).format('DD MMMM YYYY г.')}</Text>
                        </Box>
                    </Flex>
                    <Box w='340px'>
                        <Title title='Итого'/>
                        <TotalCostTable items={order.items}/>
                    </Box>
                </Flex>
            </Box>
            }
        </MainBlockLayout>
    );
};

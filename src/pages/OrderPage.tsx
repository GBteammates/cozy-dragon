import React, { memo, useEffect, useMemo, useState } from 'react';
import { useParams } from "react-router-dom";
import { Box, Flex, Heading, HStack, IconButton, Image, List, ListItem, Text, useClipboard } from "@chakra-ui/react";
import { getHeaderConfig } from "../utilities/getHeaderConfig";
import OrderService from "../api/OrderService";
import MainBlockLayout from "../UI/MainBlockLayout";
import Loader from "../UI/Loader";
import { toCurrency } from "../utilities/formatCurrency";
import TotalCostTable from "../UI/TotalCostTable";
import OrderStatusBadge from "../UI/OrderStatusBadge";
import { ICreatedOrder } from '../models/IOrder';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../UI/ErrorMessage';
import { getDate } from '../utilities/getDate';
import { getTime } from '../utilities/getTime';

export const OrderPage = memo(() => {
    const {t, i18n} = useTranslation();
    const lang = i18n.language === 'en' ? 'en-US' : 'Ru-ru';
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
            setError(t('Failed to load order information'));
        } finally {
            setIsLoading(false);
        }
    }

    const Title = ({title}: { title: string }) => (
        <Heading size='lg' my={3} py={3} borderBottom='1px solid' borderBottomColor='gray.300'>{title}</Heading>
    )

    const memorizedListOfItems = useMemo(() => (
        <List flexGrow={1} spacing={3} overflowY='auto' py={5}>
            {order?.items?.map(({item, quantity}) => (
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
                                    src={item?.image[0]}
                                    fallbackSrc='/assets/images/placeholder-image.jpg'
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
    ), [order?.items]);

    if (isLoading) {
        return (
            <MainBlockLayout link={`/orders`} linkTitle={t('Go to my orders')}>
                {isLoading && <Loader/>}
            </MainBlockLayout>
        )
    }
    if (error) {
        return (
            <MainBlockLayout link={`/orders`} linkTitle={t('Go to my orders')}>
                <Box py='40px' textAlign='center'>
                    <ErrorMessage message={error} borderRadius='2xl'/>
                </Box>
            </MainBlockLayout>
        )
    }

    return (
        <MainBlockLayout link={`/orders`} linkTitle={t('Go to my orders')}>
            {order && <Box w='100%' my={8}>
                <Flex justifyContent='space-between' alignItems='start'>
                    <Box>
                        <Heading>
                            {t('Order from')}&nbsp;{getDate(order?.created_at, lang)}
                        </Heading>
                        <Flex gap={2} alignItems='center'>
                            <Text mt={2} color='gray.500' fontSize='lg'>
                                {t('Created at')} {getTime(order?.created_at, lang)} - №{order?.id}
                            </Text>
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
                            <Title title={t('Your order')}/>
                            {memorizedListOfItems}
                        </Box>
                        <Box>
                            <Title title={t('Delivery details')}/>
                            <Text fontSize='sm' color='gray'>{t('Address')}</Text>
                            <Text>
                                {order.address.zipcode}, {order.address.country}, {order.address.city}, {order.address.street}
                            </Text>
                            <Text fontSize='sm' color='gray' mt={3}>{t('Delivery date')}</Text>
                            <Text>{getDate(order?.shipment_time, lang)}</Text>
                        </Box>
                    </Flex>
                    <Box w='340px'>
                        <Title title={t('Total')}/>
                        <TotalCostTable items={order.items}/>
                    </Box>
                </Flex>
            </Box>
            }
        </MainBlockLayout>
    );
});

import React from 'react';
import {Badge} from "@chakra-ui/react";
import {ORDER_STATUS} from '../models/IOrder';
import { useTranslation } from 'react-i18next';

interface OrderStatusBadgeProps {
    status: string
}

const OrderStatusBadge = ({status}: OrderStatusBadgeProps) => {
    const {t} = useTranslation();

    const getOrderStatus = () => {
        switch (status) {
            case ORDER_STATUS.ORDER_CREATED.status: {
                return {
                    text: t(ORDER_STATUS.ORDER_CREATED.status),
                    color: ORDER_STATUS.ORDER_CREATED.color
                }
            }
            case ORDER_STATUS.ORDER_PROCESSING.status: {
                return {
                    text: t(ORDER_STATUS.ORDER_PROCESSING.status),
                    color: ORDER_STATUS.ORDER_PROCESSING.color
                }
            }
            case ORDER_STATUS.ORDER_PROCESSED.status: {
                return {
                    text: t(ORDER_STATUS.ORDER_PROCESSED.status),
                    color: ORDER_STATUS.ORDER_PROCESSED.color
                }
            }
            case ORDER_STATUS.READY_FOR_SHIPMENT.status: {
                return {
                    text: t(ORDER_STATUS.READY_FOR_SHIPMENT.status),
                    color: ORDER_STATUS.READY_FOR_SHIPMENT.color
                }
            }
            case ORDER_STATUS.PICKED_BY_COURIER.status: {
                return {
                    text: t(ORDER_STATUS.PICKED_BY_COURIER.status),
                    color: ORDER_STATUS.PICKED_BY_COURIER.color
                }
            }
            case ORDER_STATUS.DELIVERED.status: {
                return {
                    text: t(ORDER_STATUS.DELIVERED.status),
                    color: ORDER_STATUS.DELIVERED.color
                }
            }
        }
    }

    return (
        <Badge colorScheme={getOrderStatus()?.color} fontSize='sm' px={2} borderRadius='2xl'>
            {getOrderStatus()?.text}
        </Badge>
    );
};

export default OrderStatusBadge;
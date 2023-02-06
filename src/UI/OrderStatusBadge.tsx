import React from 'react';
import {Badge} from "@chakra-ui/react";
import {ORDER_STATUS} from '../models/IOrder';

interface OrderStatusBadgeProps {
    status: string
}

const OrderStatusBadge = ({status}: OrderStatusBadgeProps) => {
    const getOrderStatus = () => {
        switch (status) {
            case ORDER_STATUS.ORDER_CREATED.status: {
                return {text: ORDER_STATUS.ORDER_CREATED.translation, color: ORDER_STATUS.ORDER_CREATED.color}
            }
            case ORDER_STATUS.ORDER_PROCESSING.status: {
                return {text: ORDER_STATUS.ORDER_PROCESSING.translation, color: ORDER_STATUS.ORDER_PROCESSING.color}
            }
            case ORDER_STATUS.ORDER_PROCESSED.status: {
                return {text: ORDER_STATUS.ORDER_PROCESSED.translation, color: ORDER_STATUS.ORDER_PROCESSED.color}
            }
            case ORDER_STATUS.READY_FOR_SHIPMENT.status: {
                return {text: ORDER_STATUS.READY_FOR_SHIPMENT.translation, color: ORDER_STATUS.READY_FOR_SHIPMENT.color}
            }
            case ORDER_STATUS.PICKED_BY_COURIER.status: {
                return {text: ORDER_STATUS.PICKED_BY_COURIER.translation, color: ORDER_STATUS.PICKED_BY_COURIER.color}
            }
            case ORDER_STATUS.DELIVERED.status: {
                return {text: ORDER_STATUS.DELIVERED.translation, color: ORDER_STATUS.DELIVERED.color}
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
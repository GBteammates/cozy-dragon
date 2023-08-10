import {ICart, ICartItem} from "./ICart";
import {IAddress} from "./ICustomer";

export const ORDER_STATUS = {
    ORDER_CREATED: {
        status: 'order created',
        color: 'gray'
    },
    ORDER_PROCESSING: {
        status: 'order processing',
        color: 'yellow'
    },
    ORDER_PROCESSED: {
        status: 'order processed',
        color: 'orange'
    },
    READY_FOR_SHIPMENT: {
        status: 'ready for shipment',
        color: 'cyan'
    },
    PICKED_BY_COURIER: {
        status: 'picked by courier',
        color: 'purple'
    },
    DELIVERED: {
        status: 'delivered',
        color: 'green'
    }
}

export type IOrder = {
    address: IAddress,
    cart: ICart,
    user: {
        email: string,
        id: string,
        role: string
    }
}

export interface ICreatedOrder {
    address: IAddress,
    id: string,
    items: ICartItem[],
    shipment_time: string,
    created_at: string,
    status: string,
    user_id: string
}

export interface IEditOrderStatus {
    order_id: string,
    status: string,
    user: {
        email: string,
        id: string,
        role: string
    }
}

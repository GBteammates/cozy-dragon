import {ICart, ICartItem} from "./ICart";
import {IAddress} from "./ICustomer";

export const ORDER_STATUS = {
    ORDER_CREATED: {
        status: 'order created',
        translation: 'заказ создан',
        color: 'gray'
    },
    ORDER_PROCESSING: {
        status: 'order processing',
        translation: 'заказ в обработке',
        color: 'yellow'
    },
    ORDER_PROCESSED: {
        status: 'order processed',
        translation: 'заказ обработан',
        color: 'orange'
    },
    READY_FOR_SHIPMENT: {
        status: 'ready for shipment',
        translation: 'заказ готов к отгрузке',
        color: 'cyan'
    },
    PICKED_BY_COURIER: {
        status: 'picked by courier',
        translation: 'курьер забрал заказ',
        color: 'purple'
    },
    DELIVERED: {
        status: 'delivered',
        translation: 'заказ доставлен',
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

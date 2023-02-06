import { IProduct } from "./IProduct";

export type ICart = {
    id: string,
    items: ICartItem[],
    userId: string
}

export type ICartItem = {
    item: IProduct
    quantity: number,
}
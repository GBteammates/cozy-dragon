import {ICategory} from "./ICategory";

export type IProduct = {
    id: string,
    title: string,
    price: number,
    category: ICategory,
    description: string,
    image: string[],
    vendor: string,
    isFavourite: boolean
}
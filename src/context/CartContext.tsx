import React, {ReactNode, useContext, useEffect, useState} from "react";
import {IProduct} from "../models/IProduct";
import CartService from "../api/CartService";
import {ToastError, ToastInfo} from "../utilities/error-handling";
import {ICart, ICartItem} from "../models/ICart";
import {getCartId} from "../utilities/local-storage-handling";
import {getHeaderConfig} from "../utilities/getHeaderConfig";

type CartProviderProps = {
    children: ReactNode
}

export type CartItem = {
    product: IProduct,
    quantity: number
}

type CartContextProps = {
    openCart: () => void
    closeCart: () => void
    isOpen: boolean
    isLoadingCart: boolean
    getTotalQuantity: () => number
    getTotalCost: (items: ICartItem[]) => number
    onAddItemToCart: (id: string) => void
    onDeleteItemFromCart: (id: string) => void
    onEmptyCartContext: () => void
    onFetchCart: (id: string) => void
    getCartQuantity: () => number
    cart: ICart,
    getItemQuantity: (id: string) => number
}

const CartContext = React.createContext({} as CartContextProps);

export const useCart = () => {
    return useContext(CartContext);
}

export const CartProvider = ({children}: CartProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const [cart, setCart] = useState<ICart>({} as ICart);
    const cartId = getCartId();

    useEffect(() => {
        if (getCartQuantity() > 0) {
            openCart();
        } else {
            closeCart();
        }
    }, [cart])

    const openCart = () => {
        setIsOpen(true);
    }
    const closeCart = () => {
        setIsOpen(false);
    }

    const getCartQuantity = () => {
        return cart?.items?.reduce((quantity, item) => item.quantity + quantity, 0);
    };

    const getItemQuantity = (id: string) => {
        return cart?.items?.find(({item}) => item.id == id)?.quantity ?? 0
    }

    const getTotalQuantity = () => {
        return cart?.items?.reduce((total, {quantity}) => {
            return total + quantity
        }, 0)
    }

    const getTotalCost = (items: ICartItem[]) => {
        return items?.reduce((total, cartItem) => {
            return total + cartItem.quantity * Number(cartItem.item.price)
        }, 0)
    }

    const onFetchCart = async (cartID: string) => {
        try {
            setIsLoadingCart(true);
            const config = getHeaderConfig();
            const {data} = await CartService.getCart(cartID, config);
            setCart(data);
        } catch (e: any) {
            ToastError(e?.message);
        } finally {
            setIsLoadingCart(false);
        }
    };

    const onAddItemToCart = async (id: string) => {
        if (cartId && id) {
            try {
                const config = getHeaderConfig();
                await CartService.addItemToCart(cartId, id, config);
                onFetchCart(cartId);
            } catch (e: any) {
                ToastInfo(e?.message);
            }
        }
    }

    const onDeleteItemFromCart = async (id: string) => {
        if (cartId) {
            try {
                const config = getHeaderConfig();
                await CartService.deleteItemFromCart(cartId, id, config);
                onFetchCart(cartId);
            } catch (e: any) {
                ToastInfo(e?.message);
            }
        }
    }

    const onEmptyCartContext = () => {
        setCart({} as ICart);
    }

    return (
        <CartContext.Provider
            value={{
                getItemQuantity,
                getTotalQuantity,
                getTotalCost,
                onAddItemToCart,
                onDeleteItemFromCart,
                onFetchCart,
                getCartQuantity,
                cart,
                onEmptyCartContext,
                openCart,
                closeCart,
                isOpen,
                isLoadingCart
            }}>
            {children}
        </CartContext.Provider>
    )
}

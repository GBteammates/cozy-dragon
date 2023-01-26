import React, {ReactNode, useContext, useEffect, useState} from "react";
import {IProduct} from "../models/IProduct";
import CartService from "../api/CartService";
import {ToastError, ToastInfo} from "../utilities/error-handling";
import {ICart} from "../models/ICart";
import {getToken} from "../utilities/local-storage-handling";

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
    onFetchCartByUserId: (userId: string) => void
    getTotalQuantity: () => number
    getTotalCost: () => number
    getItemsCost: () => number
    getDeliveryCost: () => number
    onAddItemToCart: (id: string) => void
    onDeleteItemFromCart: (id: string) => void
    onRemoveCart: () => void
    onEmptyCartContext: () => void
    onFetchCart: (id: string) => void
    getCartQuantity: () => number
    cart: ICart,
    getItemQuantity: (id: string) => number
}

export const DELIVERY_COST_BASE = 100;

const CartContext = React.createContext({} as CartContextProps);

export const useCart = () => {
    return useContext(CartContext);
}

export const CartProvider = ({children}: CartProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [cart, setCart] = useState<ICart>({} as ICart);
    const [cartId, setCartId] = useState('');

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

    const getItemsCost = () => {
        return cart?.items?.reduce((total, cartItem) => {
            return total + cartItem.quantity * Number(cartItem.item.price)
        }, 0)
    }

    const getTotalCost = () => {
        return getItemsCost() + getDeliveryCost()
    }

    const getDeliveryCost = () => {
        return getTotalQuantity() < 6 ? DELIVERY_COST_BASE : DELIVERY_COST_BASE * 3
    }

    const onCreateCart = async (userId: string) => {
        if (userId) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${getToken()}` }
                };
                const {data} = await CartService.createCart(userId, config);
                setCartId(data.id);
            } catch (e: any) {
                ToastError(e?.message);
            }
        }
    };

    const onFetchCartByUserId = async (userId: string) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${getToken()}` }
            };
            const {data} = await CartService.getCartByUserId(userId, config);
            if (data) {
                setCartId(data.id);
                setCart(data);
                setIsOpen(true);
            }
        } catch (e: any) {
            if (e.response.status === 404 || e.response.status === 500) {
                onCreateCart(userId);
            } else {
                ToastError(e?.message);
            }
        }
    }

    const onFetchCart = async (cartID: string) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${getToken()}` }
            };
            const {data} = await CartService.getCart(cartID, config);
            setCart(data);
        } catch (e: any) {
            ToastError(e?.message);
        }
    };

    const onRemoveCart = async () => {
        if (cartId) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${getToken()}` }
                };
                await CartService.deleteCart(cartId, config);
                onEmptyCartContext();
            } catch (e: any) {
                ToastError(e?.message);
            }
        }
    };

    const onAddItemToCart = async (id: string) => {
        if (cartId && id) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${getToken()}` }
                };
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
                const config = {
                    headers: { Authorization: `Bearer ${getToken()}` }
                };
                await CartService.deleteItemFromCart(cartId, id, config);
                onFetchCart(cartId);
            } catch (e: any) {
                ToastInfo(e?.message);
            }
        }
    }

    const onEmptyCartContext = () => {
        setCart({} as ICart);
        setCartId('');
    }

    return (
        <CartContext.Provider
            value={{
                getItemQuantity,
                getItemsCost,
                getTotalQuantity,
                getTotalCost,
                getDeliveryCost,
                onAddItemToCart,
                onDeleteItemFromCart,
                onFetchCart,
                getCartQuantity,
                cart,
                onFetchCartByUserId,
                onRemoveCart,
                onEmptyCartContext,
                openCart,
                closeCart,
                isOpen
            }}>
            {children}
        </CartContext.Provider>
    )
}

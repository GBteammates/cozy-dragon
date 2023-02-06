import React from 'react';
import {IconButton} from "@chakra-ui/react";
import {FaHeart, FaRegHeart} from "react-icons/fa";
import {useCustomer} from "../context/CustomerContext";
import {getHeaderConfig} from "../utilities/getHeaderConfig";
import ProductService from "../api/ProductService";
import {ToastError} from "../utilities/error-handling";

interface FavoriteSwitcherProps {
    isFav: boolean,
    productId: string,
    customerId: string,
    handleSetIsFav: (value: boolean) => void
}

export const FavoriteSwitcher = ({isFav, productId, customerId, handleSetIsFav}: FavoriteSwitcherProps) => {
    const {isAdmin, isAuth} = useCustomer();

    const onAddFavorite = async () => {
        try {
            const config = getHeaderConfig();
            await ProductService.addFavoriteProduct(customerId, productId, config);
            handleSetIsFav(true);
        } catch (e: any) {
            ToastError(e?.message);
        }
    }

    const onDeleteFavorite = async () => {
        try {
            const config = getHeaderConfig();
            await ProductService.deleteFavoriteProduct(customerId, productId, config);
            handleSetIsFav(false);
        } catch (e: any) {
            ToastError(e?.message);
        }
    }

    return (
        <IconButton icon={isFav ? <FaHeart/> : <FaRegHeart/>}
                    aria-label='Редактировать'
                    borderRadius='50%'
                    backgroundColor='white'
                    color={isFav ? 'red' : 'gray.400'}
                    boxShadow='lg'
                    fontSize='x-large'
                    _hover={{color: isFav ? 'gray.500' : 'red'}}
                    _focus={{boxShadow: 'none'}}
                    isDisabled={isAdmin || !isAuth}
                    onClick={() => isFav ? onDeleteFavorite() : onAddFavorite()}
        />
    );
};
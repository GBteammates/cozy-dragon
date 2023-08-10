import CartButton from "./CartButton";
import {IconButton} from "@chakra-ui/react";
import {MdFavorite} from "react-icons/md";
import React from "react";

export const Links = [
    {
        title: 'Cart',
        icon: <CartButton/>,
        path: 'cart'
    },
    {
        title: 'Favorites',
        icon: <IconButton aria-label='Favorites' fontSize='x-large' icon={<MdFavorite/>}/>,
        path: 'favorites'
    }
];

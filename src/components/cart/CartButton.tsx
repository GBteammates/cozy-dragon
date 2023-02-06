import React from 'react';
import {useCart} from "../../context/CartContext";
import {Button, IconButton, Text} from "@chakra-ui/react";
import {BsBagFill} from "react-icons/bs";
import {toCurrency} from "../../utilities/formatCurrency";

const CartButton = () => {
    const {cart, getTotalCost} = useCart();
    return (
        <>
            {cart?.items?.length > 0 ?
                <Button leftIcon={<BsBagFill fontSize='x-large'/>} colorScheme='yellow' variant='solid'
                        fontSize='large'>
                    <Text as='span' pt={1} fontWeight='normal'>{toCurrency(getTotalCost(cart?.items))}</Text>
                </Button>
                :
                <IconButton
                    aria-label='Корзина'
                    fontSize='x-large'
                    icon={<BsBagFill/>}
                />
            }
        </>
    )
};

export default CartButton;
import React from 'react';
import {Button, HStack, IconButton, Text} from '@chakra-ui/react';
import {FaMinus, FaPlus} from 'react-icons/fa';
import {useCart} from '../context/CartContext';
import {IProduct} from '../models/IProduct';
import {useCustomer} from '../context/CustomerContext';
import {ToastInfo} from '../utilities/error-handling';
import { useTranslation } from 'react-i18next';

interface CounterProps {
    product: IProduct,
    quantity?: number,
    buttonColor?: string
}

const Counter = (props: CounterProps) => {
    const {t} = useTranslation();
    const {product, quantity = 0, buttonColor = 'gray.50'} = props;
    const {isAdmin, isAuth} = useCustomer();
    const {onAddItemToCart, onDeleteItemFromCart, isLoadingCart} = useCart();

    if (quantity === 0) {
        return (
            <Button backgroundColor={buttonColor}
                    border='1px solid'
                    borderColor='gray.200'
                    rounded='xl'
                    width='100%'
                    px={8}
                    py={6}
                    transition='all .3s ease'
                    _hover={{boxShadow: 'md'}}
                    isDisabled={isAdmin}
                    onClick={() => {
                        if (!isAuth) {
                            ToastInfo(t('Log in to add items to cart'))
                        } else {
                            onAddItemToCart(product.id)
                        }
                    }}
            >
                {t('Add to bag')}
            </Button>
        )
    }
    return (
        <HStack rounded='xl'
                backgroundColor='gray.50'
                border='1px solid'
                borderColor='gray.200'
                justifyContent='space-around'
                cursor='default'
                transition='all .3s ease'
                _hover={{boxShadow: 'md'}}>
            <IconButton aria-label='Minus'
                        icon={<FaMinus/>}
                        variant='ghost'
                        borderRadius='xl'
                        py={6}
                        _focus={{boxShadow: 'none'}}
                        isDisabled={isLoadingCart}
                        _disabled={{color: 'black', cursor: 'wait'}}
                        onClick={() => onDeleteItemFromCart(product.id)}
            />
            <Text textAlign={'center'} fontSize={'large'} fontWeight='bold' px={2}>
                {quantity}
            </Text>
            <IconButton aria-label='Plus'
                        icon={<FaPlus/>}
                        variant='ghost'
                        borderRadius='xl'
                        py={6}
                        _focus={{boxShadow: 'none'}}
                        isDisabled={isLoadingCart}
                        _disabled={{color: 'black', cursor: 'wait'}}
                        onClick={() => onAddItemToCart(product.id)}
            />
        </HStack>
    );
};

export default Counter;
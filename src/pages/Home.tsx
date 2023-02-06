import React from 'react';
import {
    Grid,
    GridItem
} from '@chakra-ui/react';
import {CategoryList} from "../components/category/CategoryList";
import ProductList from '../components/product/ProductList';
import CartSidebar from "../components/cart/CartSidebar";
import {useCart} from "../context/CartContext";
import {useCustomer} from "../context/CustomerContext";

export const Home = () => {
    const {isAdmin} = useCustomer();
    const {isOpen} = useCart();

    return (
        <Grid
            templateAreas={`"nav main aside"`}
            gridTemplateRows={'1fr'}
            gridTemplateColumns={`260px minmax(350px, 1fr) ${!isAdmin && isOpen ? '450px' : 0}`}
            h='100%'
            color='blackAlpha.800'
            bg='gray.50'
        >
            <GridItem area={'nav'}>
                <CategoryList/>
            </GridItem>
            <GridItem area={'main'} overflow={"hidden"}>
                <ProductList/>
            </GridItem>
            <GridItem area={'aside'}>
                {!isAdmin && isOpen && <CartSidebar/>}
            </GridItem>
        </Grid>
    );
}

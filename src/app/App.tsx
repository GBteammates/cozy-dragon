import * as React from "react"
import { ChakraProvider, theme, } from "@chakra-ui/react"
import { CartProvider } from "../context/CartContext";
import { Layout } from "../UI/Layout";
import AppRouter from "../router/AppRouter";
import { CategoryProvider } from "../context/CategoryContext";
import { CustomerProvider } from "../context/CustomerContext";

export const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <CategoryProvider>
                <CustomerProvider>
                    <CartProvider>
                        <Layout>
                            <AppRouter/>
                        </Layout>
                    </CartProvider>
                </CustomerProvider>
            </CategoryProvider>
        </ChakraProvider>
    )
}

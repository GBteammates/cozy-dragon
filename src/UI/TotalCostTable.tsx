import React from 'react';
import {Table, TableContainer, Tbody, Td, Tfoot, Th, Tr} from "@chakra-ui/react";
import {toCurrency} from "../utilities/formatCurrency";
import {useCart} from "../context/CartContext";
import {ICartItem} from "../models/ICart";

const TotalCostTable = ({items}: {items: ICartItem[]}) => {
    const {getTotalCost} = useCart();

    return (
        <TableContainer mt={2} mb={4}>
            <Table variant='unstyled'>
                <Tbody>
                    <Tr>
                        <Td py={3} pl={0}>Товары</Td>
                        <Td py={3} fontWeight='bold'>
                            {toCurrency(getTotalCost(items))}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td py={3} pl={0}>Доставка</Td>
                        <Td py={3} fontWeight='bold'>{toCurrency(0)}</Td>
                    </Tr>
                </Tbody>
                <Tfoot>
                    <Tr borderTop='1px solid' borderColor='gray.300'>
                        <Th py={5} pl={0} fontSize='large' fontWeight='bold'>К оплате</Th>
                        <Th py={5} isNumeric fontSize='large' fontWeight='bold'>
                            {toCurrency(getTotalCost(items))}
                        </Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    );
};

export default TotalCostTable;
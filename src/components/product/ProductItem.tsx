import {Box, Flex, Image, Stack, Text} from '@chakra-ui/react';
import {FC, useState} from "react";
import {Link} from 'react-router-dom';
import {useCart} from "../../context/CartContext";
import {IProduct} from '../../models/IProduct';
import {toCurrency} from "../../utilities/formatCurrency";
import Counter from "../../UI/Counter";
import {FavoriteSwitcher} from "../../UI/FavoriteSwitcher";
import {useCustomer} from "../../context/CustomerContext";
import {slashEscape} from "../../utilities/RegExpURL";

interface ProductItemProps {
    product: IProduct
}

export const ProductItem: FC<ProductItemProps> = ({product}) => {
    const {id, image, price, title} = product;
    const [isFav, setIsFav] = useState(product?.isFavourite);
    const {isAdmin, isAuth, customer} = useCustomer();
    const {getItemQuantity} = useCart();

    const handleSetIsFav = (value: boolean) => {
        setIsFav(value);
    }

    return (
        <Flex
            maxW='300px'
            minW='260px'
            overflow='hidden'
            bg='gray.100'
            border='1px solid'
            borderColor='gray.100'
            zIndex={1}
            rounded='2xl'
            flexDirection='column'
            transition={'all .3s ease'}
            _hover={{backgroundColor: 'gray.200'}}
            justifyContent='space-between'
            position='relative'
        >
            {isAuth && <Box position='absolute'
                            right={2}
                            top={2}>
                <FavoriteSwitcher
                    isFav={isFav}
                    customerId={customer.id}
                    productId={id}
                    handleSetIsFav={handleSetIsFav}
                />
            </Box>}
            <Box py={4}>
                <Link
                    to={isAdmin
                        ? `/edit/${id}`
                        : `/${slashEscape(product.category?.name)?.toLowerCase()}/${product.id}`}>
                    <Flex height='250px' width='100%' justifyContent='center'>
                        {image && <Image
                            maxH='100%'
                            maxW='100%'
                            objectFit={'contain'}
                            src={image[0]}
                            fallbackSrc={'/assets/images/placeholder-image.jpg'}
                        />}
                    </Flex>
                    <Stack height='130px' alignItems='start' justifyContent='center' px={4}>
                        <Text fontWeight={700} fontSize={'xl'}>
                            {toCurrency(price)}
                        </Text>
                        <Text textAlign='left' fontSize={'md'} fontWeight={500} noOfLines={3}>
                            {title}
                        </Text>
                    </Stack>
                </Link>
                <Box px={4}>
                    <Counter product={product} quantity={getItemQuantity(id)}/>
                </Box>
            </Box>
        </Flex>
    );
}
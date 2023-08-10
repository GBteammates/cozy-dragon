import React, { memo, useCallback, useEffect, useState } from 'react';
import { Box, Button, Divider, Flex, Heading, Skeleton, SkeletonText, Text, useDisclosure } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { IProduct } from '../models/IProduct';
import { toCurrency } from '../utilities/formatCurrency';
import Counter from '../UI/Counter';
import { useCart } from '../context/CartContext';
import { FavoriteSwitcher } from '../UI/FavoriteSwitcher';
import MainBlockLayout from '../UI/MainBlockLayout';
import { isEmpty } from '../utilities/isEmpty';
import AddEditProductDrawer from '../modals/AddEditProduct/AddEditProductDrawer';
import Carousel from '../UI/Carousel';
import { ToastError, ToastSuccess } from '../utilities/error-handling';
import { useCategory } from '../context/CategoryContext';
import RemoveProductModal from '../modals/RemoveProductModal';
import ErrorMessage from '../UI/ErrorMessage';
import CategoryService from '../api/CategoryService';
import ProductService from '../api/ProductService';
import { AiOutlineReload } from 'react-icons/ai';
import { useCustomer } from '../context/CustomerContext';
import { getHeaderConfig } from '../utilities/getHeaderConfig';
import { useTranslation } from 'react-i18next';

export const ProductPage = memo(() => {
    const {t} = useTranslation();
    const {productId} = useParams();
    const navigate = useNavigate();
    const editDisclosure = useDisclosure();
    const removeDisclosure = useDisclosure();

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const [product, setProduct] = useState<IProduct>({} as IProduct);

    const {onChangeCategories, currentCategory} = useCategory();
    const {isAdmin, customer} = useCustomer();
    const {getItemQuantity} = useCart();

    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => {
        if (isAdmin && editDisclosure.isOpen) {
            fetchCategories();
        }
    }, [editDisclosure.isOpen]);


    const getProduct = async () => {
        if (productId) {
            setError('');
            setIsLoading(true);
            try {
                const config = getHeaderConfig();
                const {data} = await ProductService.getProduct(productId, config);
                setProduct(data);
                setIsFav(data.isFavourite);
            } catch (e: any) {
                setError(e?.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            const {data} = await CategoryService.getCategories();
            onChangeCategories(data);
            setIsLoading(false);
        } catch (error: any) {
            setError(error?.message);
        }
    }, [onChangeCategories]);

    const onEditProduct = async (result: IProduct) => {
        if (productId) {
            try {
                const config = getHeaderConfig();
                await ProductService.updateProduct(
                    {
                        ...product,
                        title: result.title,
                        price: result.price,
                        category: result.category.id,
                        description: result.description,
                        image: result.image,
                        vendor: result.vendor
                    }, config);
                ToastSuccess(t('The item has been successfully edited'));
                editDisclosure.onClose();
            } catch (e: any) {
                ToastError(e?.message);
            } finally {
                getProduct();
            }
        }
    }

    const onRemoveProduct = async () => {
        if (productId) {
            try {
                const config = getHeaderConfig();
                await ProductService.deleteProduct(productId, config);
                ToastSuccess(t('The item has been removed'));
                navigate(`/${currentCategory?.name?.toLowerCase() ?? ''}`)
            } catch (e: any) {
                ToastError(e?.message);
            }
        }
    }

    const handleSetIsFav = useCallback((value: boolean) => {
        setIsFav(value);
    }, []);

    if (isLoading && isEmpty(product)) {
        return (
           <MainBlockLayout>
               <Flex gap={10} mt='60px'>
                   <Skeleton height='400px' rounded='2xl' maxW='600px' flex={2} startColor='gray.300'
                             endColor='gray.300'/>
                   <Flex flexDirection='column' justifyContent='center' mt='-10px' flex={1} height='500px'
                         maxW='500px' gap={5}>
                       <Skeleton height='84px' w='320px' mt={8} borderRadius='2xl'/>
                       <SkeletonText noOfLines={3} spacing='2' my={8}/>
                       <SkeletonText noOfLines={4} spacing='4'/>
                   </Flex>
               </Flex>
           </MainBlockLayout>
        )
    }

    if (error) {
        return (
            <MainBlockLayout>
                <Flex mt='40px' gap={5} alignItems='center'>
                    <Button leftIcon={<AiOutlineReload/>} colorScheme='yellow'
                            minWidth='fit-content' py={6} borderRadius='2xl'
                            onClick={() => getProduct()}>
                        {t('Reload the page')}
                    </Button>
                    <ErrorMessage message={error} borderRadius='2xl'/>
                </Flex>
            </MainBlockLayout>
        )
    }

    return (
        <MainBlockLayout>
            {!isEmpty(product) &&
                <Box>
                    {isAdmin && (
                        <Flex mt={6} gap={5}>
                            <Button
                                colorScheme='yellow'
                                borderRadius='2xl'
                                py={6}
                                disabled={!!error}
                                onClick={editDisclosure.onOpen}
                            >
                                {t('Edit the item')}
                            </Button>
                            <Button
                                colorScheme='red'
                                borderRadius='2xl'
                                py={6}
                                disabled={!!error}
                                onClick={removeDisclosure.onOpen}
                            >
                                {t('Delete the item')}
                            </Button>
                        </Flex>
                    )}
                    <Flex alignItems='flex-start' mt='30px'>
                        <Text fontSize='xx-large' noOfLines={3} mr={4}>{product.title}</Text>
                    </Flex>
                    <Flex gap={10} pt={6}>
                        <Flex
                            maxH='600px'
                            maxW='600px'
                            minW='500px'
                            w='50%'
                            justifyContent='center'
                            position='relative'
                        >
                            <Carousel images={product.image}/>
                        </Flex>
                        <Flex w='50%' flexDirection='column' gap={8} justifyContent='start'>
                            <Flex
                                border='1px solid' borderColor='gray.200' rounded='3xl' p={4}
                                justifyContent='space-between' alignItems='center' minW='390px' maxW='400px' gap={3}>
                                <Text flex={1} color='red.600' fontSize='x-large'>
                                    {toCurrency(product.price)}
                                </Text>
                                <Flex flex={1} gap={3} textAlign='right' alignItems='center'>
                                    <Counter
                                        product={product}
                                        quantity={getItemQuantity(product.id)}
                                        buttonColor='yellow.400'
                                    />
                                    <FavoriteSwitcher
                                        customerId={customer.id}
                                        productId={product.id}
                                        isFav={isFav}
                                        handleSetIsFav={handleSetIsFav}
                                    />
                                </Flex>
                            </Flex>
                            <Box width='100%'>
                                <Heading fontSize='md'>
                                    {t('About the item')}
                                </Heading>
                                <Divider my={3}/>
                                <Text textAlign='justify'>{product.description}</Text>
                            </Box>
                        </Flex>
                    </Flex>
                </Box>
            }
            <AddEditProductDrawer
                isEdit={true}
                product={product}
                isOpen={editDisclosure.isOpen}
                onClose={editDisclosure.onClose}
                onSubmit={onEditProduct}
            />
            <RemoveProductModal
                product={product}
                isOpen={removeDisclosure.isOpen}
                onClose={removeDisclosure.onClose}
                onRemoveProduct={onRemoveProduct}
            />
        </MainBlockLayout>
    );
});
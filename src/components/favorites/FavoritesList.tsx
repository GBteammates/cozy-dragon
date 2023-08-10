import React, {useEffect, useMemo, useState} from 'react';
import {IProduct} from "../../models/IProduct";
import {useCategory} from "../../context/CategoryContext";
import {getUserId} from "../../utilities/local-storage-handling";
import ProductService from "../../api/ProductService";
import {ToastError} from "../../utilities/error-handling";
import {Box, Button, Center, Flex, Heading, Icon, SimpleGrid, Text} from "@chakra-ui/react";
import {IoIosHeartEmpty} from "react-icons/io";
import {MdFavorite} from "react-icons/md";
import {Link} from "react-router-dom";
import SkeletonList from "../../UI/SkeletonList";
import {ProductItem} from '../product/ProductItem';
import ErrorMessage from '../../UI/ErrorMessage';
import {slashEscape} from "../../utilities/RegExpURL";
import {getHeaderConfig} from '../../utilities/getHeaderConfig';
import {useCustomer} from "../../context/CustomerContext";
import { useTranslation } from 'react-i18next';

const FavoritesList = () => {
    const {t} = useTranslation();
    const [list, setList] = useState([] as IProduct[]);
    const [favListQuantity, setFavListQuantity] = useState(0);
    const {currentCategory} = useCategory();
    const {isAuth} = useCustomer();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const limit = 8;

    useEffect(() => {
        updateList();
    }, [isAuth])

    useEffect(() => {
        if (isLoading) {
            fetchFavList();
        }
    }, [isLoading]);

    const fetchFavList = async () => {
        setError('');
        try {
            if (list.length <= favListQuantity) {
                const config = getHeaderConfig();
                const userId = getUserId();
                if (userId) {
                    const {data} = await ProductService.getFavoriteProducts(userId, limit, offset, config)
                    setList([...list, ...data.items]);
                    setOffset(prevState => prevState + limit);
                    setFavListQuantity(data.quantity);
                }
            }
        } catch (e: any) {
            if (list?.length > 0) {
                ToastError(t('Failed to load favorites list'));
            } else {
                setError(t('Failed to load list of favorite items. Please try again later.'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateList = () => {
        window.scroll({
            top: 0,
            left: 0,
        });
        setList([]);
        setOffset(0);
        setIsLoading(true);
    }

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return function () {
            document.removeEventListener('scroll', scrollHandler)
        }
    })

    const scrollHandler = (e: any) => {
        const scrollHeight = e.target.documentElement.scrollHeight;
        const scrollTop = e.target.documentElement.scrollTop;
        const innerHeight = window.innerHeight;
        if (scrollHeight - (scrollTop + innerHeight) < 100 && favListQuantity > 0 && offset < favListQuantity) {
            setIsLoading(true)
        }
    }

    const memoizedList = useMemo(() => (
        <>
            {list?.map(product => (
                <ProductItem product={product} key={product.id}/>
            ))}
        </>
    ), [list]);


    const EmptyList = () => (
        <Flex alignItems='center' justifyContent='center' gap={4} flexDirection='column' mt={10}>
            <Icon fontSize='140px' color='gray.400' as={IoIosHeartEmpty}/>
            <Heading fontSize='xx-large' my={2}>
                {t('Favorites list is empty')}
            </Heading>
            <Text color='gray' textAlign='center'>
                {t('There is nothing here yet, but you can add the item to your favorites by clicking on')}
                <Icon as={MdFavorite} ml='2'/>
            </Text>
            <Link to={`/${slashEscape(currentCategory?.name) ?? ''}`}>
                <Button colorScheme='yellow' px={10} mt={6}>
                    {t('Go to catalog')}
                </Button>
            </Link>
        </Flex>
    )

    if (error && list?.length === 0) {
        return <Center h='50vh'>
            <Box py='40px' textAlign='center'>
                <ErrorMessage message={error} borderRadius='2xl'/>
            </Box>
        </Center>
    }

    return (
        <>
            <Box
                textAlign='left'
                py='40px'
                px='50px'
                width='100%'
                height='100%'
                bg='gray.50'
                overflowY='auto'
            >
                <SimpleGrid minChildWidth='250px' width='100%' spacing='10'>
                    {isLoading && list?.length === 0 && <SkeletonList amount={8}/>}
                    {memoizedList}
                </SimpleGrid>
                {!isLoading && list?.length === 0 && <EmptyList/>}
            </Box>

        </>
    );
};

export default FavoritesList;

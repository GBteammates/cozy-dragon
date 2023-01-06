import {Box, Button, Center, Flex, Heading, SimpleGrid, Text, useDisclosure} from '@chakra-ui/react';
import React, {useEffect, useMemo, useState} from 'react';
import {ProductItem} from "./ProductItem";
import {IProduct} from '../../models/IProduct';
import ErrorMessage from "../../UI/ErrorMessage";
import {useCategory} from "../../context/CategoryContext";
import {GrAdd} from "react-icons/gr";
import AddEditProductDrawer from '../../modals/AddEditProductDrawer';
import {isEmpty} from "../../utilities/isEmpty";
import {ToastError, ToastSuccess} from '../../utilities/error-handling';
import Loader from "../../UI/Loader";
import SkeletonList from '../../UI/SkeletonList';
import {isAdmin} from '../../constants/isAdmin';
import CategoryService from "../../api/CategoryService";
import ProductService from "../../api/ProductService";

const ProductList = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [error, setError] = useState('');
    const [offset, setOffset] = useState(0);
    const [limit] = useState(8);
    const {currentCategory, onChangeCurrentCategory, categories} = useCategory();
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        updateList();
        fetchQuantity();
    }, [currentCategory]);

    useEffect(() => {
        if (isLoading) {
            fetchProducts();
        }
    }, [isLoading]);

    const fetchProducts = async () => {
        setError('');
        if (products.length < quantity) {
            try {
                const {data} = isEmpty(currentCategory)
                    ? await ProductService.getPaginatedProducts(offset, limit)
                    : await ProductService.getAllProductsByCategory(currentCategory.name, offset, limit)

                setProducts([...products, ...data]);
                setOffset(prevState => prevState + limit);
            } catch (e: any) {
                setError(e?.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false)
        }
    };

    const fetchQuantity = async () => {
        setError('');
        try {
            const {data} = await ProductService.getQuantity(currentCategory.name);
            setQuantity(data.quantity);
            setIsLoading(true)

        } catch (e: any) {
            setError(e?.message);
        }
    };


    const updateList = () => {
        window.scroll({
            top: 0,
            left: 0,
        });
        setProducts([]);
        setOffset(0);
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
        if (scrollHeight - (scrollTop + innerHeight) < 50 && quantity > 0 && offset < quantity) {
            setIsLoading(true)
        }
    }

    const onChangeCategory = (id: number) => {
        const selectedCategory = categories.find(c => c.id == id);
        if (selectedCategory) {
            onChangeCurrentCategory(selectedCategory)
        }
    }

    const onAddNewProduct = async (values: IProduct) => {
        const result = {
            "title": values.title,
            "description": values.description,
            "price": +values.price,
            "category": values.category?.id,
            "image": values.image,
            "vendor": values.vendor
        };
        try {
            await ProductService.createProduct(result);
            if (currentCategory.id !== values.category.id) {
                onChangeCategory(values.category.id);
            } else {
                fetchQuantity();
            }
            ToastSuccess('Товар был успешно добавлен');
            onClose();
        } catch (e: any) {
            ToastError(e?.message);
        }
    }

    const memoizedList = useMemo(() => (
        <>
            {products?.map(product => (
                <ProductItem product={product} key={product.id}/>
            ))}
        </>
    ), [products]);

    const NoContent = () => {
        return isLoading ? <SkeletonList amount={8}/> : (
            <Center h='50vh'>
                <Text color='gray'>В данной категории нет товаров</Text>
            </Center>
        )
    }

    if (error) {
        return <Box py='40px'>
            <ErrorMessage message={error}/>
        </Box>
    }

    return (
        <Box
            textAlign='left'
            py='40px'
            px='50px'
            width='100%'
            height='100%'
            bg='gray.50'
            overflowY='auto'
        >
            <>
                <Flex justifyContent='space-between' gap={5}>
                    <Heading mb={5}>{currentCategory?.name?.toUpperCase() ?? 'All'.toUpperCase()}</Heading>
                    {isAdmin &&
                        <Button
                            position='fixed'
                            right='50px'
                            boxShadow='md'
                            zIndex='10'
                            rightIcon={<GrAdd/>}
                            px={6}
                            minW='fit-content'
                            colorScheme='yellow'
                            fontWeight='normal'
                            onClick={onOpen}>
                            Добавить новый товар
                        </Button>
                    }
                </Flex>
                <SimpleGrid minChildWidth='250px' width='100%' spacing='10'>
                    {memoizedList}
                </SimpleGrid>
                {isLoading && products.length > 0 && (
                    <Center mt={10}>
                        <Loader/>
                    </Center>
                )}
                {!isLoading && quantity === 0 && <NoContent/>}

            </>
            <AddEditProductDrawer isEdit={false} isOpen={isOpen} onClose={onClose} onSubmit={onAddNewProduct}/>
        </Box>
    );
};

export default ProductList;

import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Select,
    SimpleGrid,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { ProductItem } from "./ProductItem";
import { IProduct } from '../../models/IProduct';
import ErrorMessage from "../../UI/ErrorMessage";
import { useCategory } from "../../context/CategoryContext";
import { GrAdd } from "react-icons/gr";
import AddEditProductDrawer from '../../modals/AddEditProduct/AddEditProductDrawer';
import { isEmpty } from "../../utilities/isEmpty";
import { ToastError, ToastSuccess } from '../../utilities/error-handling';
import SkeletonList from '../../UI/SkeletonList';
import ProductService from "../../api/ProductService";
import { useCustomer } from "../../context/CustomerContext";
import { ICategory } from "../../models/ICategory";
import { MdClose } from 'react-icons/md';
import { getHeaderConfig } from '../../utilities/getHeaderConfig';
import { useTranslation } from 'react-i18next';

const ProductList = () => {
    const {t} = useTranslation();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [error, setError] = useState('');
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const limit = 8;

    const {isAdmin, isAuth} = useCustomer();
    const {currentCategory, onChangeCurrentCategory, categories} = useCategory();
    const {isOpen, onOpen, onClose} = useDisclosure();

    useEffect(() => {
        updateList();
    }, [currentCategory, searchQuery, sortOrder, isAuth]);

    useEffect(() => {
        if (isLoading) {
            fetchProducts();
        }
    }, [isLoading]);

    const fetchProducts = async () => {
        setError('');
        if (products.length <= quantity) {
            try {
                const config = getHeaderConfig();
                let res;
                if (searchQuery) {
                    res = await ProductService.getProductsBySearchQuery(searchQuery, offset, limit, config, sortOrder);
                } else if (isEmpty(currentCategory)) {
                    res = await ProductService.getPaginatedProducts(offset, limit, config, sortOrder);
                } else {
                    res = await ProductService.getAllProductsByCategory(currentCategory.name, offset, limit, config, sortOrder);
                }
                setProducts([...products, ...res.data.items]);
                setQuantity(res.data.quantity);
                setOffset(prevState => prevState + limit);
            } catch (e: any) {
                if (products?.length > 0) {
                    ToastError(t('Failed to load item list'));
                } else {
                    setError(t('Failed to load item list. Please try again later.'));
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    const updateList = () => {
        window.scroll({
            top: 0,
            left: 0,
        });
        setProducts([]);
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
        if (scrollHeight - (scrollTop + innerHeight) < 150 && quantity > 0 && offset < quantity) {
            setIsLoading(true)
        }
    }

    const onChangeCategory = (id: number) => {
        const selectedCategory = categories.find(c => Number(c.id) === Number(id));
        if (selectedCategory) {
            onChangeCurrentCategory(selectedCategory);
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
            const config = getHeaderConfig();
            await ProductService.createProduct(result, config);
            if (currentCategory.id !== values.category.id) {
                onChangeCategory(values.category.id);
            } else {
                updateList();
            }
            ToastSuccess(t('The item was added successfully'));
            onClose();
        } catch (e: any) {
            ToastError(e?.message);
        }
    }

    const handleSortOrderChange = (e: any) => {
        setSortOrder(e.target.value);
    }

    const SortOrderSelect = () => (
        <Select value={sortOrder}
                borderRadius='2xl'
                size='lg'
                w='320px'
                color='gray.500'
                focusBorderColor={'yellow.500'}
                placeholder={t('Sort')}
                onChange={handleSortOrderChange}>
            <option value='asc'>{t('Price low to high')}</option>
            <option value='desc'>{t('Price high to low')}</option>
        </Select>
    )

    const memoizedList = useMemo(() => (
        <>
            {products?.map(product => (
                <ProductItem product={product} key={product.id}/>
            ))}
        </>
    ), [products]);

    const handleSearchQueryChange = (e: any) => {
        setSearchQuery(e.target.value)
        if (e.target.value.length > 0) {
            onChangeCurrentCategory({} as ICategory)
        }
    }

    const NoContent = () => {
        return isLoading ? <SkeletonList amount={8}/> : (
            <Center h='50vh'>
                <Text color='gray'>{t('There are no items in this category')}</Text>
            </Center>
        )
    }

    const getErrorMessage = () => {
        if (products?.length === 0) {
            return <Center h='50vh'>
                <Box py='40px' textAlign='center'>
                    <ErrorMessage message={error} borderRadius='2xl'/>
                </Box>
            </Center>
        }
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
                    <Heading mb={5}>{currentCategory?.name?.toUpperCase() ?? t('All goods').toUpperCase()}</Heading>
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
                            {t('Add new item')}
                        </Button>
                    }
                </Flex>
                {!error && <Flex my={6} alignItems='center' gap={4}>
                    <SortOrderSelect/>

                    <InputGroup size='lg'>
                        <Input
                            value={searchQuery}
                            pr='40px'
                            type='text'
                            placeholder={t('Search for items...')}
                            focusBorderColor={'yellow.500'}
                            borderRadius='2xl'
                            onChange={handleSearchQueryChange}
                        />
                        {searchQuery.length > 0 &&
                            <InputRightElement justifyContent='flex-end'>
                                <IconButton size='lg' variant='link'
                                            aria-label='Clear' icon={<MdClose/>}
                                            onClick={() => {
                                                setSearchQuery('');
                                                updateList();
                                            }}/>
                            </InputRightElement>
                        }
                    </InputGroup>
                </Flex>}
                <SimpleGrid minChildWidth='250px' width='100%' spacing='10' placeItems='center'>
                    {!error && products.length === 0 && <NoContent/>}
                    {memoizedList}
                </SimpleGrid>
                {error && getErrorMessage()}
            </>
            <AddEditProductDrawer isEdit={false} isOpen={isOpen} onClose={onClose} onSubmit={onAddNewProduct}/>
        </Box>
    );
};

export default ProductList;

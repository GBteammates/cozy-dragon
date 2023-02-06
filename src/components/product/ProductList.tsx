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
    SimpleGrid,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import React, {useEffect, useMemo, useState} from 'react';
import {ProductItem} from "./ProductItem";
import {IProduct} from '../../models/IProduct';
import ErrorMessage from "../../UI/ErrorMessage";
import {useCategory} from "../../context/CategoryContext";
import {GrAdd} from "react-icons/gr";
import AddEditProductDrawer from '../../modals/AddEditProductDrawer';
import {isEmpty} from "../../utilities/isEmpty";
import {ToastError, ToastSuccess} from '../../utilities/error-handling';
import SkeletonList from '../../UI/SkeletonList';
import ProductService from "../../api/ProductService";
import {useCustomer} from "../../context/CustomerContext";
import {ICategory} from "../../models/ICategory";
import {MdClose} from 'react-icons/md';
import { getHeaderConfig } from '../../utilities/getHeaderConfig';


const ProductList = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [error, setError] = useState('');
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const limit = 8;

    const {isAdmin, isAuth} = useCustomer();
    const {currentCategory, onChangeCurrentCategory, categories} = useCategory();
    const {isOpen, onOpen, onClose} = useDisclosure();


    useEffect(() => {
        updateList();
    }, [currentCategory, searchQuery, isAuth]);

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
                    res = await ProductService.getProductsBySearchQuery(searchQuery, offset, limit, config)
                } else {
                    res = isEmpty(currentCategory)
                        ? await ProductService.getPaginatedProducts(offset, limit, config)
                        : await ProductService.getAllProductsByCategory(currentCategory.name, offset, limit, config);
                }
                setProducts([...products, ...res.data.items]);
                setQuantity(res.data.quantity);
                setOffset(prevState => prevState + limit);
            } catch (e: any) {
                if (products?.length > 0) {
                    ToastError('Не удалось загрузить список товаров');
                } else {
                    setError('Не удалось загрузить список товаров. Повторите попытку позже.');
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
        const selectedCategory = categories.find(c => c.id == id);
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

    const handleSearchQueryChange = (e: any) => {
        setSearchQuery(e.target.value)
        if (e.target.value.length > 0) {
            onChangeCurrentCategory({} as ICategory)
        }
    }

    const NoContent = () => {
        return isLoading ? <SkeletonList amount={8}/> : (
            <Center h='50vh'>
                <Text color='gray'>В данной категории нет товаров</Text>
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
                    <Heading mb={5}>{currentCategory?.name?.toUpperCase() ?? 'Все товары'.toUpperCase()}</Heading>
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
                {!error && <Flex my={6}>
                    <InputGroup size='lg'>
                        <Input
                            pr='160px'
                            type='text'
                            placeholder='Поиск по товарам...'
                            value={searchQuery}
                            focusBorderColor={'yellow.500'}
                            onChange={handleSearchQueryChange}
                        />
                        <InputRightElement width='160px' px={2} justifyContent='flex-end'>
                            {searchQuery.length > 0 &&
                                <IconButton size='lg' variant='link'
                                            aria-label='Clear' icon={<MdClose/>}
                                            onClick={() => {
                                                setSearchQuery('');
                                                updateList();
                                            }}/>
                            }
                            <Button size='m' px={4} py={1} colorScheme='blackAlpha' onClick={() => {
                                onChangeCurrentCategory({} as ICategory)
                            }}>
                                Поиск
                            </Button>
                        </InputRightElement>
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

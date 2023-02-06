import {Box, Button, Center, Flex, Skeleton, Stack, Text, useDisclosure} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {NavItem} from '../../UI/NavItem';
import {useCategory} from '../../context/CategoryContext';
import {ICategory} from '../../models/ICategory';
import {isEmpty} from '../../utilities/isEmpty';
import {DeleteIcon, EditIcon} from '@chakra-ui/icons';
import ErrorMessage from '../../UI/ErrorMessage';
import RemoveCategoryModal from '../../modals/RemoveCategoryModal';
import EditCategoryModal from '../../modals/EditCategoryModal';
import {ToastError, ToastSuccess} from '../../utilities/error-handling';
import CreateCategoryModal from '../../modals/CreateCategoryModal';
import CategoryService from "../../api/CategoryService";
import {useCustomer} from "../../context/CustomerContext";
import { getHeaderConfig } from '../../utilities/getHeaderConfig';

export const CategoryList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const editDisclosure = useDisclosure();
    const createDisclosure = useDisclosure();
    const removeDisclosure = useDisclosure();
    const {isAdmin} = useCustomer();
    const {currentCategory, categories, onChangeCurrentCategory, onChangeCategories} = useCategory();
    const [selectedCategory, setSelectedCategory] = useState({} as ICategory);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const {data} = await CategoryService.getCategories();
            onChangeCategories(data);
        } catch (error: any) {
            setError('Не удалось загрузить список категорий');
        } finally {
            setIsLoading(false);
        }
    };

    const onRemoveCategory = async (id: number) => {
        try {
            const config = getHeaderConfig();
            await CategoryService.deleteCategory(id, config);
            fetchCategories();
            ToastSuccess('Категория была удалена');
            removeDisclosure.onClose();
        } catch (e: any) {
            ToastError(e?.message);
        }
    }

    const onEditCategory = async (category: ICategory) => {
        try {
            const config = getHeaderConfig();
            await CategoryService.updateCategory(category.id, category, config);
            fetchCategories();
            ToastSuccess('Категория была отредактирована');
            editDisclosure.onClose();
        } catch (e: any) {
            ToastError(e?.message);
        } finally {
            onChangeCurrentCategory({...category, name: category.name});
        }
    }

    const onCreateCategory = async (category: ICategory) => {
        try {
            const config = getHeaderConfig();
            await CategoryService.createCategory({
                'name': category.name,
                'description': category.description,
                'image': ''
            }, config);
            fetchCategories();
            ToastSuccess('Категория была успешно создана');
            createDisclosure.onClose();
        } catch (e: any) {
            ToastError(e?.message);
        }
    }

    if (error) {
        return (
            <Box
                bg='white'
                borderRight='1px'
                position='sticky'
                top='80px'
                pb={4}
                height='calc(100vh - 80px)'
                borderRightColor='gray.200'>
                <ErrorMessage message={'Не удалось получить список категорий'}/>
            </Box>
        )
    }

    if (isLoading) {
        return (
            <Stack spacing={5} mt={4} pl={4}>
                {Array(5)
                    .fill(null)
                    .map((_, index) => <Skeleton key={index} height='56px'/>)}
            </Stack>
        )
    }

    return (
        <>
            {!isLoading && <Box
                bg='white'
                borderRight='1px'
                position='sticky'
                top='80px'
                py={4}
                height='calc(100vh - 80px)'
                borderRightColor='gray.200'
                overflowY='auto'>
                {isAdmin && <Button mx={2} mb={2} onClick={() => createDisclosure.onOpen()}>
                    Добавить категорию
                </Button>}

                {categories.length === 0 && <Center>
                    <Text mt={4} mx={2} color='gray' fontSize='sm'>
                        Список категорий пуст
                    </Text>
                </Center>}

                {categories.length > 0 && <NavItem
                    key={0}
                    fontWeight={isEmpty(currentCategory) ? '800' : '400'}
                    onClick={() => onChangeCurrentCategory({} as ICategory)}
                >
                    Все товары
                </NavItem>}
                {categories?.map((category) => (
                    <Flex
                        key={category.id}
                        w='100%'
                        alignItems='center'
                        color='gray.400'
                        _hover={{backgroundColor: 'gray.400', color: 'gray.600'}}>
                        <NavItem
                            fontWeight={currentCategory.name === category.name ? '800' : '400'}
                            onClick={() => onChangeCurrentCategory(category)}
                        >
                            {category.name}
                        </NavItem>

                        {isAdmin &&
                            <EditIcon mr={2} fontSize='xl' cursor='pointer' _hover={{color: 'white'}}
                                      onClick={() => {
                                          setSelectedCategory(category);
                                          editDisclosure.onOpen();
                                      }}/>}
                        {isAdmin &&
                            <DeleteIcon mr={2} fontSize='xl' cursor='pointer' _hover={{color: 'white'}}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            removeDisclosure.onOpen();
                                        }}/>}
                    </Flex>
                ))}
            </Box>}
            <CreateCategoryModal
                isOpen={createDisclosure.isOpen}
                onClose={createDisclosure.onClose}
                onCreateCategory={onCreateCategory}
            />
            <EditCategoryModal
                isOpen={editDisclosure.isOpen}
                onClose={editDisclosure.onClose}
                category={selectedCategory}
                onEditCategory={onEditCategory}
            />
            <RemoveCategoryModal
                isOpen={removeDisclosure.isOpen}
                onClose={removeDisclosure.onClose}
                category={selectedCategory}
                onRemoveCategory={onRemoveCategory}
            />
        </>
    );
};


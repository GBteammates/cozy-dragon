import { Button, Center, Flex, Skeleton, Stack, Text, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { NavItem } from '../../UI/NavItem';
import { useCategory } from '../../context/CategoryContext';
import { ICategory } from '../../models/ICategory';
import { isEmpty } from '../../utilities/isEmpty';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import ErrorMessage from '../../UI/ErrorMessage';
import RemoveCategoryModal from '../../modals/RemoveCategoryModal';
import EditCategoryModal from '../../modals/EditCategoryModal';
import { ToastError, ToastSuccess } from '../../utilities/error-handling';
import CreateCategoryModal from '../../modals/CreateCategoryModal';
import CategoryService from "../../api/CategoryService";
import { useCustomer } from "../../context/CustomerContext";
import { getHeaderConfig } from '../../utilities/getHeaderConfig';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../UI/Sidebar';

export const CategoryList = () => {
    const {t} = useTranslation();
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
            setError(t('Failed to load category list'));
        } finally {
            setIsLoading(false);
        }
    };


    const onRemoveCategory = useCallback(async (id: number) => {
        try {
            const config = getHeaderConfig();
            await CategoryService.deleteCategory(id, config);
            await fetchCategories();
            ToastSuccess(t('Category has been removed'));
            removeDisclosure.onClose();
        } catch (e: any) {
            ToastError(e?.message);
        }
    }, [fetchCategories, removeDisclosure, t]);

    const onEditCategory = useCallback(async (category: ICategory) => {
        try {
            const config = getHeaderConfig();
            await CategoryService.updateCategory(category.id, category, config);
            await fetchCategories();
            ToastSuccess(t('Category has been edited'));
            onChangeCurrentCategory({...category, name: category.name});
            editDisclosure.onClose();
        } catch (e: any) {
            ToastError(e?.message);
        }
    }, [editDisclosure, fetchCategories, onChangeCurrentCategory, t]);

    const onCreateCategory = useCallback(async (category: ICategory) => {
        try {
            const config = getHeaderConfig();
            await CategoryService.createCategory({
                'name': category.name,
                'description': category.description,
                'image': ''
            }, config);
            fetchCategories();
            ToastSuccess(t('Category has been successfully created'));
            createDisclosure.onClose();
        } catch (e: any) {
            ToastError(e?.message);
        }
    }, [createDisclosure, fetchCategories, t]);


    const categoryList = () => {
        if (categories.length === 0) {
            return (
                <Center>
                    <Text mt={4} mx={2} color='gray' fontSize='sm'>
                        {t('Category list is empty')}
                    </Text>
                </Center>
            )
        } else {
            return (
                <>
                    <NavItem
                        key={0}
                        fontWeight={isEmpty(currentCategory) ? '800' : '400'}
                        onClick={() => onChangeCurrentCategory({} as ICategory)}
                    >
                        {t('All goods')}
                    </NavItem>
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

                            {isAdmin && (
                                <>
                                    <EditIcon
                                        mr={2} fontSize='xl' cursor='pointer' _hover={{color: 'white'}}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            editDisclosure.onOpen();
                                        }}
                                    />
                                    <DeleteIcon
                                        mr={2} fontSize='xl' cursor='pointer' _hover={{color: 'white'}}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            removeDisclosure.onOpen();
                                        }}
                                    />
                                </>
                            )}
                        </Flex>
                    ))}
                </>
            )
        }
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

    if (error) {
        return (
            <Sidebar>
                <ErrorMessage message={t('Failed to get list of categories')}/>
            </Sidebar>
        )
    }

    return (
        <>
            <Sidebar>
                {isAdmin && (
                    <Button mx={2} mb={2} onClick={() => createDisclosure.onOpen()}>
                        {t('Add category')}
                    </Button>
                )}
                {categoryList()}
            </Sidebar>
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


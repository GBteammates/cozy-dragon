import React, {useState} from 'react';
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormControl,
    FormLabel,
    Input,
    Select,
    Stack,
    Text,
    Textarea
} from "@chakra-ui/react";
import {Field, Form, Formik, FormikHelpers} from 'formik';
import * as Yup from "yup";
import {useCategory} from "../../context/CategoryContext";
import axios from "axios";
import {ToastError, ToastSuccess} from "../../utilities/error-handling";

interface Values {
    title: string;
    price: string;
    description: string;
    image: string;
    category: string;
}

interface NewProductDrawerProps {
    isOpen: boolean,
    onClose: () => void,
}

const NewProductDrawer = ({isOpen, onClose}: NewProductDrawerProps) => {
    const {currentCategory, categories} = useCategory();
    const [isLoading, setIsLoading] = useState(false);

    const ValidationSchema = Yup.object().shape({
        title: Yup.string()
            .min(5, 'Пожалуйста, введите не меньше 5 символов')
            .max(70, 'Пожалуйста, введите не более 70 символов')
            .required('Пожалуйста, заполните обязательное поле'),
        image: Yup.string()
            .url('Некорректная ссылка')
            .required('Пожалуйста, добавьте ссылку на изображение'),
        description: Yup.string()
            .min(5, 'Пожалуйста, введите не меньше 5 символов')
            .max(400, 'Пожалуйста, введите не более 400 символов')
            .required('Пожалуйста, заполните обязательное поле'),
        price: Yup.string()
            .required('Пожалуйста, заполните обязательное поле'),
    });

    const onAddNewProduct = async (values: Values) => {
        const selectedCategory = categories.find(i => i.name === values.category);
        const result = {...values, category: selectedCategory};
        setIsLoading(true);
        await axios.put('https://fakestoreapi.com/products', result)
            .then(() => {
                ToastSuccess('The product was successfully added')
                setTimeout(() => onClose(), 2000)
            })
            .catch(error => {
                ToastError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
        >
            <DrawerOverlay backdropFilter='blur(2px)'/>
            <DrawerContent minWidth='500px'>
                <DrawerCloseButton/>
                <DrawerHeader borderBottomWidth='1px' backgroundColor='gray.100' boxShadow='md' minH='80px' d='flex'
                              alignItems='center'>
                    Новый товар
                </DrawerHeader>

                <Formik
                    style={{height: '100%'}}
                    initialValues={{
                        title: '',
                        price: '',
                        description: '',
                        image: '',
                        category: currentCategory.name,
                    }}
                    validationSchema={ValidationSchema}
                    onSubmit={(
                        values: Values,
                        {setSubmitting}: FormikHelpers<Values>
                    ) => {
                        onAddNewProduct(values)
                        setSubmitting(false);
                    }}
                >
                    <Form style={{height: '100%'}}>
                        <DrawerBody style={{height: '100%'}}>
                            <Stack spacing={6} py={4}>
                                <FormControl>
                                    <FormLabel htmlFor='category' fontSize='sm' color='gray.400'>Категория
                                        товара</FormLabel>
                                    <Field name="category">
                                        {({field, meta}: any) => (
                                            <>
                                                <Select id='category' name='category'
                                                        {...field}>
                                                    {categories.map(category => (
                                                        <option value={category.name}
                                                                key={category.id}>{category.name}</option>
                                                    ))}
                                                </Select>
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm'>{meta.error}</Text>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor='title' fontSize='sm' color='gray.400'>Наименование
                                        товара</FormLabel>
                                    <Field name="title">
                                        {({field, meta}: any) => (
                                            <>
                                                <Input variant='flushed' type="text"
                                                       placeholder="Введите наименование товара..."
                                                       isInvalid={meta.touched ? meta.error : false} {...field} />
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm'>{meta.error}</Text>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor='image' fontSize='sm' color='gray.400'>Фото товара</FormLabel>
                                    <Field name="image">
                                        {({field, meta}: any) => (
                                            <>
                                                <Input type='url' variant='flushed'
                                                       placeholder='Добавьте ссылку на изображение'
                                                       isInvalid={meta.touched ? meta.error : false} {...field} />
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm'>{meta.error}</Text>
                                                )}

                                            </>
                                        )}
                                    </Field>
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor='description' fontSize='sm' color='gray.400'>Описание</FormLabel>
                                    <Field name="description">
                                        {({field, meta}: any) => (
                                            <>
                                                <Textarea id='description' name='description'
                                                          placeholder='Введите описание...' p={1}
                                                          isInvalid={meta.touched ? meta.error : false} {...field} />
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm'>{meta.error}</Text>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor='price' fontSize='sm' color='gray.400'>Цена</FormLabel>
                                    <Field name="price">
                                        {({field, meta}: any) => (
                                            <>
                                                <Input variant='flushed' type="number"
                                                       placeholder='Введите цену товара...'
                                                       isInvalid={meta.touched ? meta.error : false} {...field} />
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm'>{meta.error}</Text>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </FormControl>
                            </Stack>
                        </DrawerBody>
                        <DrawerFooter borderTopWidth='1px' position='sticky' bottom={0} right={0}>
                            <Button variant='outline' mr={3} fontWeight='500' onClick={onClose}>
                                Отмена
                            </Button>
                            <Button colorScheme='yellow' type='submit' fontWeight='500' isLoading={isLoading}
                                    loadingText='Сохранение...'>Сохранить</Button>
                        </DrawerFooter>
                    </Form>
                </Formik>
            </DrawerContent>
        </Drawer>
    );
};

export default NewProductDrawer;
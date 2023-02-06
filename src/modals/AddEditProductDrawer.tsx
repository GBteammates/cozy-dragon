import React from 'react';
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Image,
    Input,
    Select,
    Stack,
    Text,
    Textarea,
    VStack
} from "@chakra-ui/react";
import {Field, FieldArray, Form, Formik, FormikHelpers} from 'formik';
import * as Yup from "yup";
import {useCategory} from "../context/CategoryContext";
import {IProduct} from "../models/IProduct";
import {BiTrash} from "react-icons/bi";

export interface Values {
    title: string;
    price: number;
    description: string;
    categoryId: number;
    image: string[];
    vendor: string
}

interface AddEditProductDrawerProps {
    isEdit: boolean,
    product?: IProduct,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (values: any) => void
}

const AddEditProductDrawer = ({
                                  isEdit,
                                  product = {} as IProduct,
                                  isOpen,
                                  onClose,
                                  onSubmit
                              }: AddEditProductDrawerProps) => {
    const {currentCategory, categories} = useCategory();

    const ValidationSchema = Yup.object().shape({
        title: Yup.string()
            .min(5, 'Пожалуйста, введите не меньше 5 символов')
            .max(100, 'Пожалуйста, введите не более 100 символов')
            .required('Пожалуйста, заполните обязательное поле'),
        // image: Yup.mixed()
        //     .when('isArray', {
        //         is: Array.isArray,
        //         then: Yup.array().of(Yup.string()),
        //         otherwise: Yup.string(),
        //     }),
        categoryId: Yup.string()
            .required('Пожалуйста, выберите категорию'),
        description: Yup.string()
            .max(900, 'Пожалуйста, введите не более 900 символов')
            .required('Пожалуйста, заполните обязательное поле'),
        vendor: Yup.string()
            .max(100, 'Пожалуйста, введите не более 100 символов')
            .required('Пожалуйста, заполните обязательное поле'),
        price: Yup.string()
            .required('Пожалуйста, заполните обязательное поле'),
    });

    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
        >
            <DrawerOverlay backdropFilter='blur(2px)'/>
            <DrawerContent minWidth='500px'>
                <DrawerCloseButton/>
                <DrawerHeader borderBottomWidth='1px' backgroundColor='gray.100' boxShadow='md' minH='80px'
                              display='flex' alignItems='center'>
                    {isEdit ? 'Редактирование товара' : 'Добавление нового товара'}
                </DrawerHeader>

                <Formik
                    initialValues={{
                        title: product.title ?? '',
                        price: product.price ?? '',
                        description: product.description ?? '',
                        categoryId: product.category?.id ?? currentCategory?.id,
                        image: product.image ?? [''],
                        vendor: product.vendor ?? ''
                    }}
                    validationSchema={ValidationSchema}
                    onSubmit={async (
                        values: Values,
                        {setSubmitting}: FormikHelpers<Values>
                    ) => {
                        const result: Partial<IProduct> = {
                            title: values.title,
                            price: values.price,
                            description: values.description,
                            category: categories.find(c => c.id == values.categoryId),
                            image: values.image,
                            vendor: values.vendor
                        }
                        await onSubmit(result);
                        setSubmitting(false);
                    }}
                >
                    {({isSubmitting, values, isValid, dirty}) => (
                        <Form style={{height: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column'}}>
                            <DrawerBody flex={1}>
                                <Stack spacing={6} py={4}>
                                    {categories?.length > 0 && <FormControl>
                                        <FormLabel htmlFor='categoryId' fontSize='m'  color='gray.500'>Категория
                                            товара</FormLabel>
                                        <Field name="categoryId">
                                            {({field, meta}: any) => (
                                                <>
                                                    <Select id='categoryId' name='categoryId' placeholder='Выберите категорию'
                                                            {...field}>
                                                        {categories.map(category => (
                                                            <option value={category.id}
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
                                    }

                                    <FormControl>
                                        <FormLabel htmlFor='title' fontSize='m' color='gray.500'>Наименование
                                            товара</FormLabel>
                                        <Field name="title">
                                            {({field, meta}: any) => (
                                                <>
                                                    <Input type="text"
                                                           isInvalid={meta.touched ? meta.error : false} {...field} />
                                                    {meta.touched && meta.error && (
                                                        <Text color='red.400' fontSize='sm'>{meta.error}</Text>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor='title' fontSize='m' color='gray.500'>Изображения
                                            товара</FormLabel>
                                        <FieldArray name="image">
                                            {({remove, push}) => (
                                                <VStack spacing={3}>
                                                    {values?.image?.length > 0 &&
                                                        values.image?.map((image, index) => (
                                                            <Box key={index} w='100%'>
                                                                <Image src={image} maxH='100px'/>
                                                                <Flex  gap={2} >
                                                                    <Field name={`image.${index}`}>
                                                                        {({field, meta}: any) => (
                                                                            <Box w='100%'>
                                                                                <Input type='url' fontSize='sm'
                                                                                       placeholder='Добавьте ссылку на изображение'
                                                                                       isInvalid={meta.touched ? meta.error : false} {...field} />
                                                                                {meta.touched && meta.error && (
                                                                                    <Text color='red.400' fontSize='sm'>Добавьте
                                                                                        ссылку на изображение</Text>
                                                                                )}
                                                                            </Box>
                                                                        )}
                                                                    </Field>
                                                                    <IconButton aria-label='Delete image' icon={<BiTrash/>}
                                                                                onClick={() => remove(index)}/>
                                                                </Flex>
                                                            </Box>

                                                        ))}
                                                    {values.image.length < 5 && <Button
                                                        mt={4}
                                                        onClick={() => push('')}
                                                    >
                                                        Добавить изображение
                                                    </Button>}
                                                </VStack>
                                            )}
                                        </FieldArray>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel htmlFor='description' fontSize='m'
                                                   color='gray.500'>Описание</FormLabel>
                                        <Field name="description">
                                            {({field, meta}: any) => (
                                                <>
                                                    <Textarea id='description' name='description' p={1} maxHeight='300px'
                                                              isInvalid={meta.touched ? meta.error : false} {...field} />
                                                    {meta.touched && meta.error && (
                                                        <Text color='red.400' fontSize='m'>{meta.error}</Text>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel htmlFor='price' fontSize='m' color='gray.500'>Цена</FormLabel>
                                        <Field name="price">
                                            {({field, meta}: any) => (
                                                <>
                                                    <Input type="number"
                                                           isInvalid={meta.touched ? meta.error : false} {...field} />
                                                    {meta.touched && meta.error && (
                                                        <Text color='red.400' fontSize='sm' >{meta.error}</Text>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor='vendor' fontSize='m'  color='gray.500'>Продавец</FormLabel>
                                        <Field name="vendor">
                                            {({field, meta}: any) => (
                                                <>
                                                    <Input type="text"
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
                            <DrawerFooter borderTopWidth='1px' bgColor='white'>
                                <Button variant='outline' mr={3} fontWeight='500' onClick={onClose}>
                                    Отмена
                                </Button>
                                <Button colorScheme='yellow' type='submit' fontWeight='500' isLoading={isSubmitting}
                                        isDisabled={!isValid || !dirty}
                                        loadingText='Сохранение...'>Сохранить</Button>
                            </DrawerFooter>
                        </Form>
                    )}
                </Formik>
            </DrawerContent>
        </Drawer>
    );
};

export default AddEditProductDrawer;
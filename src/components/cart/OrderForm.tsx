import React from 'react';
import {
    Button,
    Flex,
    FormControl,
    Input,
    InputGroup,
    InputLeftAddon,
    InputLeftElement, Text,
    Textarea,
    VStack
} from "@chakra-ui/react";
import {BsPerson} from "react-icons/bs";
import {BiHomeAlt} from "react-icons/bi";
import {MdOutlineEmail} from "react-icons/md";
import {Field, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import {useCart} from "../../context/CartContext";
import {useCustomer} from "../../context/CustomerContext";
import {IOrder} from "../../models/IOrder";

interface OrderFormProps {
    handleFormSubmit: (values: IOrder) => void
}

export interface OrderValues {
    firstname: string;
    lastname: string;
    zipcode: string;
    country: string;
    city: string;
    street: string;
    email: string;
}

export const OrderForm = ({handleFormSubmit}: OrderFormProps) => {
    const {cart} = useCart();
    const {customer} = useCustomer();

    const ValidationSchema = Yup.object().shape({
        firstname: Yup.string()
            .max(70, 'Пожалуйста, введите не более 70 символов')
            .required('Пожалуйста, заполните обязательное поле'),
        lastname: Yup.string()
            .max(70, 'Пожалуйста, введите не более 70 символов')
            .required('Пожалуйста, заполните обязательное поле'),
        zipcode: Yup.string()
            .required('Пожалуйста, заполните обязательное поле'),
        country: Yup.string()
            .required('Пожалуйста, заполните обязательное поле'),
        city: Yup.string()
            .required('Пожалуйста, заполните обязательное поле'),
        street: Yup.string()
            .required('Пожалуйста, заполните обязательное поле'),
        email: Yup.string()
            .email('Введен некорректный email')
            .required('Пожалуйста, заполните обязательное поле')
    });

    return (
        <Formik
            initialValues={{
                firstname: customer?.firstname ?? '',
                lastname: customer?.lastname ?? '',
                zipcode: customer?.address?.zipcode ?? '',
                country: customer?.address?.country ?? '',
                city: customer?.address?.city ?? '',
                street: customer?.address?.street ?? '',
                email: customer?.email ?? ''
            }}
            validationSchema={ValidationSchema}
            onSubmit={(
                values: OrderValues,
                {setSubmitting}: FormikHelpers<OrderValues>
            ) => {
                const address = {city: values.city, country: values.country, street: values.street, zipcode: values.zipcode}
                const order: IOrder = {address: address, cart: cart, user: {email: values.email, id: customer.id, role: 'Customer'} }
                handleFormSubmit(order);
                setSubmitting(false);
            }}
        >
            {({isSubmitting, isValid, dirty}) => (
                    <Form>
                        <VStack spacing={3} px={1} align='stretch' justifyContent='space-between'>
                            <Text fontWeight='bold' mt={3}>Имя и фамилия</Text>
                            <Flex gap={3}>
                                <FormControl id="firstname">
                                    <Field name="firstname">
                                        {({field, meta}: any) => (
                                            <>
                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents="none"
                                                        children={<BsPerson color="gray.800"/>}
                                                    />
                                                    <Input type="text"
                                                           placeholder="Введите Ваше имя..."
                                                           isInvalid={meta.touched ? meta.error : false} {...field} />
                                                </InputGroup>
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm' mt={1}>{meta.error}</Text>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </FormControl>
                                <FormControl id="lastname">
                                    <Field name="lastname">
                                        {({field, meta}: any) => (
                                            <>
                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents="none"
                                                        children={<BsPerson color="gray.800"/>}
                                                    />
                                                    <Input type="text"
                                                           placeholder="Введите Вашу фамилию..."
                                                           isInvalid={meta.touched ? meta.error : false} {...field} />
                                                </InputGroup>
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm' mt={1}>{meta.error}</Text>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </FormControl>
                            </Flex>
                            <Text fontWeight='bold' mt={3}>Адрес</Text>
                            <Flex gap={3}>
                                <FormControl id="zipcode">
                                    <Field name="zipcode">
                                        {({field, meta}: any) => (
                                            <>
                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents="none"
                                                        children={<BiHomeAlt color="gray.800"/>}
                                                    />
                                                    <Input type="text"
                                                           placeholder="Индекс"
                                                           isInvalid={meta.touched ? meta.error : false} {...field} />

                                                </InputGroup>
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm' mt={1}>{meta.error}</Text>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </FormControl>
                                <FormControl id="country">
                                    <Field name="country">
                                        {({field, meta}: any) => (
                                            <>
                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents="none"
                                                        children={<BiHomeAlt color="gray.800"/>}
                                                    />
                                                    <Input type="text"
                                                           placeholder="Страна"
                                                           isInvalid={meta.touched ? meta.error : false} {...field} />

                                                </InputGroup>
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm' mt={1}>{meta.error}</Text>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </FormControl>
                            </Flex>

                            <Flex gap={3}>
                                <FormControl id="city">
                                    <Field name="city">
                                        {({field, meta}: any) => (
                                            <>
                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents="none"
                                                        children={<BiHomeAlt color="gray.800"/>}
                                                    />
                                                    <Input type="text"
                                                           placeholder="Город"
                                                           isInvalid={meta.touched ? meta.error : false} {...field} />

                                                </InputGroup>
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm' mt={1}>{meta.error}</Text>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </FormControl>
                                <FormControl id="street">
                                    <Field name="street">
                                        {({field, meta}: any) => (
                                            <>
                                                <InputGroup>
                                                    <InputLeftElement
                                                        pointerEvents="none"
                                                        children={<BiHomeAlt color="gray.800"/>}
                                                    />
                                                    <Input type="text"
                                                           placeholder="Улица, дом, квартира"
                                                           isInvalid={meta.touched ? meta.error : false} {...field} />

                                                </InputGroup>
                                                {meta.touched && meta.error && (
                                                    <Text color='red.400' fontSize='sm' mt={1}>{meta.error}</Text>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </FormControl>
                            </Flex>
                            <Text fontWeight='bold' mt={3}>Контакты</Text>
                            <FormControl id="email">
                                <Field name="email">
                                    {({field, meta}: any) => (
                                        <>
                                            <InputGroup>
                                                <InputLeftElement
                                                    pointerEvents="none"
                                                    children={<MdOutlineEmail color="gray.800"/>}
                                                />
                                                <Input type="email"
                                                       placeholder="Введите ваш адрес электронной почты..."
                                                       isInvalid={meta.touched ? meta.error : false} {...field} />
                                            </InputGroup>
                                            {meta.touched && meta.error && (
                                                <Text color='red.400' fontSize='sm' mt={1}>{meta.error}</Text>
                                            )}
                                        </>
                                    )}
                                </Field>
                            </FormControl>
                            <Button
                                type='submit'
                                variant="solid"
                                colorScheme='yellow'
                                isLoading={isSubmitting}
                                isDisabled={!isValid}>
                                Отправить заказ
                            </Button>
                        </VStack>
                    </Form>
                )}
        </Formik>
    );
};
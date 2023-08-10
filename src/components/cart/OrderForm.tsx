import React from 'react';
import { Button, Flex, FormControl, Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";
import { BsPerson } from "react-icons/bs";
import { BiHomeAlt } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useCart } from "../../context/CartContext";
import { useCustomer } from "../../context/CustomerContext";
import { IOrder } from "../../models/IOrder";
import { useTranslation } from 'react-i18next';

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
    const {t} = useTranslation();
    const {cart} = useCart();
    const {customer} = useCustomer();

    const ValidationSchema = Yup.object().shape({
        firstname: Yup.string()
            .max(50, t('Please enter no more than 50 characters'))
            .required(t('Please fill in the required field')),
        lastname: Yup.string()
            .max(50, t('Please enter no more than 50 characters'))
            .required(t('Please fill in the required field')),
        zipcode: Yup.string()
            .required(t('Please fill in the required field')),
        country: Yup.string()
            .required(t('Please fill in the required field')),
        city: Yup.string()
            .required(t('Please fill in the required field')),
        street: Yup.string()
            .required(t('Please fill in the required field')),
        email: Yup.string()
            .email(t('Please enter a valid email'))
            .required(t('Please fill in the required field'))
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
                const address = {
                    city: values.city,
                    country: values.country,
                    street: values.street,
                    zipcode: values.zipcode,
                };
                const order: IOrder = {
                    address: address,
                    cart: cart,
                    user: {email: values.email, id: customer.id, role: 'Customer'},
                };
                handleFormSubmit(order);
                setSubmitting(false);
            }}
        >
            {({isSubmitting, isValid, dirty}) => (
                <Form>
                    <VStack spacing={3} px={1} align='stretch' justifyContent='space-between'>
                        <Text fontWeight='bold' mt={3}>
                            {t('First and last name')}
                        </Text>
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
                                                       placeholder={t('Enter your firstname')}
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
                                                       placeholder={t('Enter your lastname')}
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
                        <Text fontWeight='bold' mt={3}>
                            {t('Address')}
                        </Text>
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
                                                       placeholder={t('Zip code')}
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
                                                       placeholder={t('Country')}
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
                                                       placeholder={t('City')}
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
                                                       placeholder={t('Street, house, flat')}
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
                        <Text fontWeight='bold' mt={3}>
                            {t('Contacts')}
                        </Text>
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
                                                   placeholder={t('Enter your email')}
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
                            {t('Send the order')}
                        </Button>
                    </VStack>
                </Form>
            )}
        </Formik>
    );
};
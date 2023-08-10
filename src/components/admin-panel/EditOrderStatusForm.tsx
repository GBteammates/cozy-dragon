import React from 'react';
import { Field, Form, Formik, FormikHelpers } from "formik";
import { Button, Flex, FormControl, FormLabel, Input, Select, Stack, Text } from "@chakra-ui/react";
import * as Yup from "yup";
import { IRole } from "../../models/IRole";
import { ORDER_STATUS } from "../../models/IOrder";
import { useCustomer } from "../../context/CustomerContext";
import { useTranslation } from 'react-i18next';

export interface Values {
    orderId: string,
    status: string
}

interface EditOrderStatusFormProps {
    roles: IRole[],
    onEditOrderStatus: (result: any) => void,
    onClose: () => void
}

export const EditOrderStatusForm = (props: EditOrderStatusFormProps) => {
    const {onEditOrderStatus, onClose} = props;
    const {t} = useTranslation();
    const {customer} = useCustomer();

    const ValidationSchema = Yup.object().shape({
        orderId: Yup.string()
            .required(t('Please enter an order ID')),
        status: Yup.string()
            .required(t('Please select an order status'))
    });

    return (
        <Formik
            initialValues={{
                orderId: '',
                status: ''
            }}
            validationSchema={ValidationSchema}
            onSubmit={async (
                values: Values,
                {setSubmitting}: FormikHelpers<Values>
            ) => {
                const result = {
                    order_id: values.orderId,
                    status: values.status,
                    user: {
                        email: customer.email,
                        id: customer.id,
                        role: customer.rights?.rules.find((item: any) => item == 'Admin')
                    }
                }
                await onEditOrderStatus(result);
                setSubmitting(false);
            }}
        >
            {({isSubmitting, isValid, dirty}) => (
                <Form>
                    <Stack spacing={4} py={2}>
                        <FormControl>
                            <FormLabel htmlFor='orderId' fontSize='m' color='gray.500'>
                                {t('Order ID')}
                            </FormLabel>
                            <Field name="orderId">
                                {({field, meta}: any) => (
                                    <>
                                        <Input type="text" placeholder={t('Enter an order ID')}
                                               isInvalid={meta.touched ? meta.error : false} {...field} />
                                        {meta.touched && meta.error && (
                                            <Text color='red.400' mt={2}
                                                  fontSize='sm'>{meta.error}</Text>
                                        )}
                                    </>
                                )}
                            </Field>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor='status' fontSize='m' color='gray.500'>
                                {t('Order status')}
                            </FormLabel>
                            <Field name="status">
                                {({field, meta}: any) => (
                                    <>
                                        <Select id='status'
                                                name='status'
                                                placeholder={t('Select a new order status')}
                                                {...field}
                                        >
                                            {Object.values(ORDER_STATUS).map((value, index) => (
                                                <option value={value.status} key={index}>
                                                    {t(value.status)}
                                                </option>
                                            ))}
                                        </Select>
                                        {meta.touched && meta.error && (
                                            <Text color='red.400' mt={2}
                                                  fontSize='sm'>{meta.error}</Text>
                                        )}
                                    </>
                                )}
                            </Field>
                        </FormControl>
                    </Stack>
                    <Flex justifyContent={"flex-end"} mt={6}>
                        <Button variant='ghost' mr={3} onClick={onClose}>
                            {t('Cancel')}
                        </Button>
                        <Button
                            type='submit'
                            colorScheme='yellow'
                            loadingText={t('Saving...')}
                            isLoading={isSubmitting}
                            isDisabled={!isValid || !dirty}
                        >
                            {t('Save')}
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};
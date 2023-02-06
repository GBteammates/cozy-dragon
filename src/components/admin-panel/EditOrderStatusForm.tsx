import React from 'react';
import {Field, Form, Formik, FormikHelpers} from "formik";
import {Button, Flex, FormControl, FormLabel, Input, Select, Stack, Text} from "@chakra-ui/react";
import * as Yup from "yup";
import {IRole} from "../../models/IRole";
import {ORDER_STATUS} from "../../models/IOrder";
import {useCustomer} from "../../context/CustomerContext";

export interface Values {
    orderId: string,
    status: string
}

const ValidationSchema = Yup.object().shape({
    orderId: Yup.string()
        .required('Пожалуйста, введите ID заказа'),
    status: Yup.string()
        .required('Пожалуйста, выберите статус заказа')
});

interface EditOrderStatusFormProps {
    roles: IRole[],
    onEditOrderStatus: (result: any) => void,
    onClose: () => void
}

export const EditOrderStatusForm = ({roles, onEditOrderStatus, onClose}: EditOrderStatusFormProps) => {
    const {customer} = useCustomer();

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
                            <FormLabel htmlFor='orderId' fontSize='m' color='gray.500'>ID заказа</FormLabel>
                            <Field name="orderId">
                                {({field, meta}: any) => (
                                    <>
                                        <Input type="text"
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
                            <FormLabel htmlFor='status' fontSize='m' color='gray.500'>Статус заказа</FormLabel>
                            <Field name="status">
                                {({field, meta}: any) => (
                                    <>
                                        <Select id='status' name='status'
                                                placeholder='Выберите новый статус заказа'
                                                {...field}>
                                            {Object.values(ORDER_STATUS).map((value, index) => (
                                                <option value={value.status}
                                                        key={index}>{value.translation}</option>
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
                        <Button variant='ghost' mr={3} onClick={onClose}>Отмена</Button>
                        <Button
                            type='submit'
                            colorScheme='yellow'
                            loadingText='Сохранение...'
                            isLoading={isSubmitting}
                            isDisabled={!isValid || !dirty}
                        >
                            Сохранить
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};
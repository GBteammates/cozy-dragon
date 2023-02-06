import React from 'react';
import {Field, Form, Formik, FormikHelpers} from "formik";
import {Button, FormControl, Input, Stack, Text} from "@chakra-ui/react";
import * as Yup from "yup";
import {ICustomer} from "../../models/ICustomer";

interface SignInByEmailFormProps {
    signInByEmail: (data: Partial<ICustomer>) => void,
}

export interface SignInByEmailFormValues {
    email: string;
    password: string;
}

const SignInByEmailForm = ({signInByEmail}: SignInByEmailFormProps) => {
    const ValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Пожалуйста, введите корректный  email')
            .required('Пожалуйста, введите ваш E-mail'),
        password: Yup.string()
            .min(8, 'Пароль должен содержать минимум 8 символов')
            .max(16, 'Пароль может содержать максимум 16 символов')
            .required('Пожалуйста, введите ваш пароль')
    });

    return (
        <Formik
            initialValues={{
                email: '',
                password: ''
            }}
            validationSchema={ValidationSchema}
            onSubmit={async (
                values: SignInByEmailFormValues,
                {setSubmitting}: FormikHelpers<SignInByEmailFormValues>
            ) => {
                signInByEmail(values)
                setSubmitting(false);
            }}
        >
            {({isValid, dirty, isSubmitting}) => (
                <Form>
                    <Stack spacing={4} textAlign='left'>
                        <FormControl>
                            <Field name='email'>
                                {({field, meta}: any) => (
                                    <>
                                        <Input type='email'
                                               placeholder='E-mail'
                                               mb={2}
                                               isInvalid={meta.touched ? meta.error : false} {...field} />
                                        {meta.touched && meta.error && (
                                            <Text color='red.400' fontSize='md'>{meta.error}</Text>
                                        )}
                                    </>
                                )}
                            </Field>
                        </FormControl>
                        <FormControl>
                            <Field name='password'>
                                {({field, meta}: any) => (
                                    <>
                                        <Input type='password'
                                               placeholder='Пароль'
                                               mb={2}
                                               isInvalid={meta.touched ? meta.error : false} {...field} />
                                        {meta.touched && meta.error && (
                                            <Text color='red.400' fontSize='md'>{meta.error}</Text>
                                        )}
                                    </>
                                )}
                            </Field>
                        </FormControl>
                        <Button type='submit'
                                colorScheme='yellow'
                                isLoading={isSubmitting}
                                isDisabled={!isValid || !dirty}>
                            Войти
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default SignInByEmailForm;
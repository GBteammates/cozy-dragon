import React from 'react';
import {Field, Form, Formik, FormikHelpers} from "formik";
import {Button, FormControl, Input, Stack, Text} from "@chakra-ui/react";
import * as Yup from "yup";

interface SignUpFormProps {
    signUpHandler: (data: SignUpFormValues) => void;
}

export interface SignUpFormValues {
    firstname: string;
    email: string;
    password: string;
}

const SignUpForm = ({signUpHandler}: SignUpFormProps) => {
    const ValidationSchema = Yup.object().shape({
        firstname: Yup.string()
            .required('Пожалуйста, введите вашe имя'),
        email: Yup.string()
            .email('Пожалуйста, введите корректный  email')
            .required('Пожалуйста, введите ваш E-mail'),
        password: Yup.string()
            .min(8, 'Пароль должен содержать минимум 8 символов')
            .max(16, 'Пароль может содержать максимум 16 символов')
            .matches(/^[A-Za-z\d]*$/, 'Пароль может содержать только латинские буквы и цифры')
            .required('Пожалуйста, введите ваш пароль')
    });

    return (
        <Formik
            initialValues={{
                firstname: '',
                email: '',
                password: ''
            }}
            validationSchema={ValidationSchema}
            onSubmit={async (
                values: SignUpFormValues,
                {setSubmitting}: FormikHelpers<SignUpFormValues>
            ) => {
                signUpHandler(values)
                setSubmitting(false);
            }}
        >
            {({isValid, dirty, isSubmitting}) => (
                <Form>
                    <Stack spacing={4} textAlign='left'>
                        <FormControl>
                            <Field name='firstname'>
                                {({field, meta}: any) => (
                                    <>
                                        <Input type='text'
                                               placeholder='Введите ваше имя'
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
                            Зарегистрироваться
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default SignUpForm;
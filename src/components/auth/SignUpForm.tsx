import React from 'react';
import { Field, Form, Formik, FormikHelpers } from "formik";
import { Button, FormControl, Input, Stack, Text } from "@chakra-ui/react";
import * as Yup from "yup";
import { useTranslation } from 'react-i18next';

interface SignUpFormProps {
    signUpHandler: (data: SignUpFormValues) => void;
}

export interface SignUpFormValues {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

const SignUpForm = ({signUpHandler}: SignUpFormProps) => {
    const {t} = useTranslation();

    const ValidationSchema = Yup.object().shape({
        firstname: Yup.string()
            .required(t('Please enter your firstname')),
        lastname: Yup.string()
            .required(t('Please enter your lastname')),
        email: Yup.string()
            .email(t('Please enter a valid email'))
            .required(t('Please enter your email')),
        password: Yup.string()
            .min(8, t('Password must contain at least 8 characters'))
            .max(16, t('Password can contain a maximum of 16 characters'))
            .matches(/^[A-Za-z\d]*$/, t('Password can only contain latin letters and numbers'))
            .required(t('Please enter a password'))
    });

    return (
        <Formik
            initialValues={{
                firstname: '',
                lastname: '',
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
                                               placeholder={t('Enter your firstname')}
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
                            <Field name='lastname'>
                                {({field, meta}: any) => (
                                    <>
                                        <Input type='text'
                                               placeholder={t('Enter your lastname')}
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
                                               placeholder={t('Enter your email')}
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
                                               placeholder={t('Enter password')}
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
                            {t('Sign up')}
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default SignUpForm;
import React from 'react';
import { Field, Form, Formik, FormikHelpers } from "formik";
import { Button, FormControl, Input, Stack, Text } from "@chakra-ui/react";
import * as Yup from "yup";
import { ICustomer } from "../../models/ICustomer";
import { useTranslation } from 'react-i18next';

interface SignInByEmailFormProps {
    signInByEmail: (data: Partial<ICustomer>) => void,
}

export interface SignInByEmailFormValues {
    email: string;
    password: string;
}

const SignInByEmailForm = ({signInByEmail}: SignInByEmailFormProps) => {
    const {t} = useTranslation();
    const ValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('Please enter a valid email'))
            .required(t('Please enter your email')),
        password: Yup.string()
            .min(8, t('Password must contain at least 8 characters'))
            .max(16, t('Password can contain a maximum of 16 characters'))
            .required(t('Please enter a password'))
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
                                               placeholder={t('Enter email')}
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
                            {t('Log in')}
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default SignInByEmailForm;
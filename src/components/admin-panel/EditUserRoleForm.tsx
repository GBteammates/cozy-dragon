import React from 'react';
import {Field, Form, Formik, FormikHelpers} from "formik";
import {Button, Flex, FormControl, FormLabel, Input, Select, Stack, Text} from "@chakra-ui/react";
import * as Yup from "yup";
import {IRole} from "../../models/IRole";
import { useTranslation } from 'react-i18next';

export interface Values {
    email: string,
    roleName: string
}

interface EditUserRoleFormProps {
    roles: IRole[],
    onEditUserRole: (result: any) => void,
    onClose: () => void
}

export const EditUserRoleForm = (props: EditUserRoleFormProps) => {
    const {roles, onEditUserRole, onClose} = props;
    const {t} = useTranslation();

    const ValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('Please enter a valid email'))
            .required(t('Please enter email')),
        roleName: Yup.string()
            .required(t('Please enter select user role')),
    });

    return (
        <Formik
            initialValues={{
                email: '',
                roleName: '',
            }}
            validationSchema={ValidationSchema}
            onSubmit={async (
                values: Values,
                {setSubmitting}: FormikHelpers<Values>
            ) => {
                const result = {
                    rights: {name: values.roleName},
                    email: values.email
                }
                await onEditUserRole(result);
                setSubmitting(false);
            }}
        >
            {({isSubmitting, isValid, dirty}) => (
                <Form>
                    <Stack spacing={4} py={2}>
                        <FormControl>
                            <FormLabel htmlFor='email' fontSize='m' color='gray.500'>
                                {t('User email')}
                            </FormLabel>
                            <Field name="email">
                                {({field, meta}: any) => (
                                    <>
                                        <Input type="email" placeholder={t('Enter email')}
                                               isInvalid={meta.touched ? meta.error : false} {...field} />
                                        {meta.touched && meta.error && (
                                            <Text color='red.400' mt={2} fontSize='sm'>
                                                {meta.error}
                                            </Text>
                                        )}
                                    </>
                                )}
                            </Field>
                        </FormControl>
                        {roles?.length > 0 && <FormControl>
                            <FormLabel htmlFor='roleName' fontSize='m' color='gray.500'>
                                {t('User role')}
                            </FormLabel>
                            <Field name="roleName">
                                {({field, meta}: any) => (
                                    <>
                                        <Select id='roleName' name='roleName'
                                                placeholder={t('Select user role')}
                                                {...field}>
                                            {roles.map((role) => (
                                                <option value={role.name} key={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </Select>
                                        {meta.touched && meta.error && (
                                            <Text color='red.400' mt={2} fontSize='sm'>
                                                {meta.error}
                                            </Text>
                                        )}
                                    </>
                                )}
                            </Field>
                        </FormControl>
                        }
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
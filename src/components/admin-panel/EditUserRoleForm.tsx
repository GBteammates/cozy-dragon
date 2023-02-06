import React from 'react';
import {Field, Form, Formik, FormikHelpers} from "formik";
import {Button, Flex, FormControl, FormLabel, Input, Select, Stack, Text} from "@chakra-ui/react";
import * as Yup from "yup";
import {IRole} from "../../models/IRole";

export interface Values {
    email: string,
    roleName: string
}

const ValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Пожалуйста, введите корректный Email')
        .required('Пожалуйста, введите ваш E-mail'),
    roleName: Yup.string()
        .required('Пожалуйста, введите выберите роль'),
});

interface EditUserRoleFormProps {
    roles: IRole[],
    onEditUserRole: (result: any) => void,
    onClose: () => void
}

export const EditUserRoleForm = ({roles, onEditUserRole, onClose}: EditUserRoleFormProps) => {
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
                            <FormLabel htmlFor='email' fontSize='m' color='gray.500'>Email
                                пользователя</FormLabel>
                            <Field name="email">
                                {({field, meta}: any) => (
                                    <>
                                        <Input type="email"
                                               isInvalid={meta.touched ? meta.error : false} {...field} />
                                        {meta.touched && meta.error && (
                                            <Text color='red.400' mt={2}
                                                  fontSize='sm'>{meta.error}</Text>
                                        )}
                                    </>
                                )}
                            </Field>
                        </FormControl>
                        {roles?.length > 0 && <FormControl>
                            <FormLabel htmlFor='roleName' fontSize='m' color='gray.500'>Роль
                                пользователя</FormLabel>
                            <Field name="roleName">
                                {({field, meta}: any) => (
                                    <>
                                        <Select id='roleName' name='roleName'
                                                placeholder={'Выберите роль пользователя'}
                                                {...field}>
                                            {roles.map((role) => (
                                                <option value={role.name}
                                                        key={role.id}>{role.name}</option>
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
                        }
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
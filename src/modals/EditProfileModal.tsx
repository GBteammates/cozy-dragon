import React from 'react';
import {
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text
} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {IAddress, ICustomer} from "../models/ICustomer";
import { BsFillPersonFill } from 'react-icons/bs';

interface EditCategoryModalProps {
    customer: ICustomer,
    isOpen: boolean,
    onClose: () => void,
    onEditProfile: (customer: ICustomer) => void,
}

type Values = {
    firstname: string | undefined;
    lastname?: string | undefined;
    email: string | undefined;
    zipcode?: string | undefined;
    country?: string | undefined;
    city?: string | undefined;
    street?: string | undefined;
};

const EditProfileModal = ({
                              customer,
                              isOpen,
                              onClose,
                              onEditProfile
                          }: EditCategoryModalProps) => {
    const ValidationSchema = Yup.object().shape({
        firstname: Yup.string()
            .max(50, 'Пожалуйста, введите не более 50 символов')
            .required('Пожалуйста, введите ваше имя'),
        lastname: Yup.string()
            .max(50, 'Пожалуйста, введите не более 50 символов'),
        zipcode: Yup.string()
            .max(10, 'Пожалуйста, введите не более 10 символов'),
        email: Yup.string()
            .email('Пожалуйста, введите корректный  email')
            .required('Пожалуйста, введите ваш E-mail'),
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.4)'}}/>
            <ModalContent borderRadius='2xl' minW='500px' maxW='600px'>
                <ModalHeader>Ваши данные</ModalHeader>
                <ModalCloseButton/>
                <Formik
                    initialValues={{
                        firstname: customer?.firstname ?? '',
                        lastname: customer?.lastname ?? '',
                        zipcode: customer.address?.zipcode ?? '',
                        country: customer.address?.country ?? '',
                        city: customer.address?.city ?? '',
                        street: customer.address?.street ?? '',
                        email: customer?.email ?? ''
                    }}
                    validationSchema={ValidationSchema}
                    onSubmit={async ({firstname, lastname, email, zipcode, country, city, street}: Values) => {
                        const address: IAddress = {...customer.address, zipcode, country, city, street};
                        onEditProfile({...customer, firstname, lastname, email, address})
                    }}
                >
                    {({isValid, dirty}) => (
                        <Form>
                            <ModalBody my={4}>
                                <Stack spacing={4}>
                                    <Center mb={3}>
                                        <Icon as={BsFillPersonFill} fontSize='160px'/>
                                    </Center>
                                    <Flex gap={3}>
                                        <FormControl>
                                            <FormLabel htmlFor='firstname' fontWeight='bold'>Ваше имя</FormLabel>
                                            <Field name="firstname">
                                                {({field, meta}: any) => (
                                                    <>
                                                        <Input name='firstname' type='string' {...field}/>
                                                        {meta.touched && meta.error && (
                                                            <Text color='red.400' fontSize='sm' mt={2}>{meta.error}</Text>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor='lastname' fontWeight='bold'>Ваша фамилия</FormLabel>
                                            <Field name="lastname">
                                                {({field, meta}: any) => (
                                                    <>
                                                        <Input name='lastname' type='string' {...field}/>
                                                        {meta.touched && meta.error && (
                                                            <Text color='red.400' fontSize='sm' mt={2}>{meta.error}</Text>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                        </FormControl>
                                    </Flex>
                                    <Flex gap={3}>
                                        <FormControl >
                                            <FormLabel htmlFor='zipcode' fontWeight='bold'>Индекс</FormLabel>
                                            <Field name="zipcode">
                                                {({field, meta}: any) => (
                                                    <>
                                                        <Input name='zipcode' type='string' {...field}/>
                                                        {meta.touched && meta.error && (
                                                            <Text color='red.400' fontSize='sm' mt={2}>{meta.error}</Text>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                        </FormControl>
                                        <FormControl >
                                            <FormLabel htmlFor='country' fontWeight='bold'>Страна</FormLabel>
                                            <Field name="country">
                                                {({field, meta}: any) => (
                                                    <>
                                                        <Input name='country' type='string' {...field}/>
                                                        {meta.touched && meta.error && (
                                                            <Text color='red.400' fontSize='sm' mt={2}>{meta.error}</Text>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                        </FormControl>
                                    </Flex>
                                    <Flex gap={3}>
                                        <FormControl >
                                            <FormLabel htmlFor='city' fontWeight='bold'>Город</FormLabel>
                                            <Field name="city">
                                                {({field, meta}: any) => (
                                                    <>
                                                        <Input name='city' type='string' {...field}/>
                                                        {meta.touched && meta.error && (
                                                            <Text color='red.400' fontSize='sm' mt={2}>{meta.error}</Text>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                        </FormControl>
                                        <FormControl >
                                            <FormLabel htmlFor='street' fontWeight='bold'>Улица, дом, квартира</FormLabel>
                                            <Field name="street">
                                                {({field, meta}: any) => (
                                                    <>
                                                        <Input name='street' type='string' {...field}/>
                                                        {meta.touched && meta.error && (
                                                            <Text color='red.400' fontSize='sm' mt={2}>{meta.error}</Text>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                        </FormControl>
                                    </Flex>

                                    <FormControl>
                                        <FormLabel htmlFor='email' fontWeight='bold'>Email</FormLabel>
                                        <Field name='email'>
                                            {({field, meta}: any) => (
                                                <>
                                                    <Input type='email'
                                                           placeholder='E-mail'
                                                           mb={2}
                                                           isInvalid={meta.touched ? meta.error : false}
                                                           isDisabled
                                                           {...field}/>
                                                    {meta.touched && meta.error && (
                                                        <Text color='red.400' fontSize='md'>{meta.error}</Text>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </FormControl>
                                </Stack>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant='ghost' mr={3} onClick={onClose}>
                                    Отмена
                                </Button>
                                <Button isDisabled={!isValid || !dirty}
                                        type='submit'>Сохранить</Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    );
};

export default EditProfileModal;
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
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { IAddress, ICustomer } from "../models/ICustomer";
import { BsFillPersonFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

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

const EditProfileModal = (props: EditCategoryModalProps) => {
    const {
        customer,
        isOpen,
        onClose,
        onEditProfile
    } = props;
    const {t} = useTranslation();
    const ValidationSchema = Yup.object().shape({
        firstname: Yup.string()
            .max(50, t('Please enter no more than 50 characters'))
            .required(t('Please enter your firstname')),
        lastname: Yup.string()
            .max(50, t('Please enter no more than 50 characters'))
            .required(t('Please enter your lastname')),
        zipcode: Yup.string()
            .max(10, t('Please enter no more than 10 characters')),
        email: Yup.string()
            .email(t('Please enter a valid email'))
            .required(t('Please enter your email')),
    });


    const formControl = (name: string, label: string, isDisabled?: boolean) => (
        <FormControl>
            <FormLabel htmlFor={name} color='gray.500'>
                {t(label)}
            </FormLabel>
            <Field name={name}>
                {({field, meta}: any) => (
                    <>
                        <Input name={name} type='string' isDisabled={isDisabled} {...field}/>
                        {meta.touched && meta.error && (
                            <Text color='red.400' fontSize='sm' mt={2}>
                                {meta.error}
                            </Text>
                        )}
                    </>
                )}
            </Field>
        </FormControl>
    );


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.4)'}}/>
            <ModalContent borderRadius='2xl' minW='500px' maxW='600px'>
                <ModalHeader borderBottom='1px solid' borderBottomColor='gray.200'>
                    {t('Your data')}
                </ModalHeader>
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
                                        {formControl('firstname', 'Your name')}
                                        {formControl('lastname', 'Your last name')}
                                    </Flex>
                                    <Flex gap={3}>
                                        {formControl('zipcode', 'Zip code')}
                                        {formControl('country', 'Country')}
                                    </Flex>
                                    <Flex gap={3}>
                                        {formControl('city', 'City')}
                                        {formControl('street', 'Street, house, flat')}
                                    </Flex>
                                    {formControl('email', 'Email', true)}
                                </Stack>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant='ghost' mr={3} onClick={onClose}>
                                    {t('Cancel')}
                                </Button>
                                <Button isDisabled={!isValid || !dirty} type='submit'>
                                    {t('Save')}
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    );
};

export default EditProfileModal;
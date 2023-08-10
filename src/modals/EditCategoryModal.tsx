import React from 'react';
import {
    Button,
    FormControl,
    FormLabel,
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
import { ICategory } from "../models/ICategory";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from 'react-i18next';

interface EditCategoryModalProps {
    category: ICategory,
    isOpen: boolean,
    onClose: () => void,
    onEditCategory: (category: ICategory) => void,
}

type Values = {
    name: string;
    description: string;
};

const EditCategoryModal = (props: EditCategoryModalProps) => {
    const {
        category,
        isOpen,
        onClose,
        onEditCategory
    } = props;
    const {t} = useTranslation();

    const ValidationSchema = Yup.object().shape({
        name: Yup.string()
            .required(t('Please enter a category name')),
        description: Yup.string()
            .required(t('Please add a category description'))
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.16)'}}/>
            <ModalContent borderRadius='2xl'>
                <ModalHeader borderBottom='1px solid' borderBottomColor='gray.200'>
                    {t('Edit category')}
                </ModalHeader>
                <ModalCloseButton/>

                <Formik
                    initialValues={{name: category.name, description: category.description}}
                    validationSchema={ValidationSchema}
                    onSubmit={async (values: Values) => {
                        onEditCategory({...category, name: values.name, description: values.description})
                    }}
                >
                    {({isValid, dirty}) => (
                        <Form>
                            <ModalBody my={4}>
                                <Stack spacing={4}>
                                    <FormControl>
                                        <FormLabel htmlFor='name' color='gray.500'>
                                            {t('Category name')}
                                        </FormLabel>
                                        <Field name="name">
                                            {({field, meta}: any) => (
                                                <>
                                                    <Input name='name' type='string' {...field}/>
                                                    {meta.touched && meta.error && (
                                                        <Text color='red.400' fontSize='sm' mt={2}>{meta.error}</Text>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor='description' color='gray.500'>
                                            {t('Category description')}
                                        </FormLabel>
                                        <Field name="description">
                                            {({field, meta}: any) => (
                                                <>
                                                    <Input name='description' type='string' {...field}/>
                                                    {meta.touched && meta.error && (
                                                        <Text color='red.400' fontSize='sm' mt={2}>{meta.error}</Text>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </FormControl>
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

export default EditCategoryModal;
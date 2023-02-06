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
import {Field, Form, Formik} from 'formik';
import * as Yup from "yup";

interface EditCategoryModalProps {
    isOpen: boolean,
    onClose: () => void,
    onCreateCategory: (category: any) => void,
}

type Values = {
    name: string;
    description: string
};

const CreateCategoryModal = ({
                                 isOpen,
                                 onClose,
                                 onCreateCategory
                             }: EditCategoryModalProps) => {

    const ValidationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Пожалуйста, введите название категории'),
        description: Yup.string()
            .required('Пожалуйста, добавьте описание категории')
    });


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.16)'}}/>
            <ModalContent borderRadius='2xl'>
                <ModalHeader borderBottom='1px solid' borderBottomColor='gray.200'>Создание категории</ModalHeader>
                <ModalCloseButton/>
                <Formik
                    initialValues={{name: '', description: ''}}
                    validationSchema={ValidationSchema}
                    onSubmit={async (values: Values) => {
                        onCreateCategory(values)
                    }}
                >
                    {({isValid, dirty}) => (
                        <Form>
                            <ModalBody>
                                <Stack spacing={4}>
                                    <FormControl>
                                        <FormLabel htmlFor='name' fontWeight='bold'>Название категории</FormLabel>
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
                                        <FormLabel htmlFor='description' fontWeight='bold'>Описание
                                            категории</FormLabel>
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
                                    Отмена
                                </Button>
                                <Button isDisabled={!isValid || !dirty}
                                        type='submit'>Создать</Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    );
};

export default CreateCategoryModal;
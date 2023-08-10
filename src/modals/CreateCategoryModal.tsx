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
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

interface EditCategoryModalProps {
    isOpen: boolean,
    onClose: () => void,
    onCreateCategory: (category: any) => void,
}

type Values = {
    name: string;
    description: string
};

const CreateCategoryModal = (props: EditCategoryModalProps) => {
    const {
        isOpen,
        onClose,
        onCreateCategory
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
                    {t('Create a category')}
                </ModalHeader>
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
                                        <FormLabel htmlFor='name' color={'gray.600'}>
                                            {t('Category name')}
                                        </FormLabel>
                                        <Field name='name'>
                                            {({field, meta}: any) => (
                                                <>
                                                    <Input
                                                        name='name'
                                                        type='string'
                                                        placeholder={t('Enter category name')}
                                                        {...field}
                                                    />
                                                    {meta.touched && meta.error && (
                                                        <Text color='red.400' fontSize='sm' mt={2}>{meta.error}</Text>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor='description' color={'gray.600'}>
                                            {t('Category description')}
                                        </FormLabel>
                                        <Field name='description'>
                                            {({field, meta}: any) => (
                                                <>
                                                    <Input
                                                        name='description'
                                                        type='string'
                                                        placeholder={t('Enter category description')}
                                                        {...field}
                                                    />
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
                                    {t('Create')}
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    );
};

export default CreateCategoryModal;
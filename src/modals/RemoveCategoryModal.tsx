import React from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import {ICategory} from "../models/ICategory";
import { useTranslation } from 'react-i18next';

interface RemoveCategoryModalProps {
    category: ICategory
    isOpen: boolean,
    onClose: () => void,
    onRemoveCategory: (id: number) => void
}

const RemoveCategoryModal = (props: RemoveCategoryModalProps) => {
    const {category, isOpen, onClose, onRemoveCategory} = props;
    const {t} = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.16)'}}/>
            <ModalContent borderRadius='2xl'>
                <ModalHeader borderBottom='1px solid' borderBottomColor='gray.200'>
                    {t('Delete category')}
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody my={4}>
                    <Text>
                        {t('Are you sure you want to delete the category')}
                        <b> {category.name}</b>?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={() => onRemoveCategory(category.id)}>
                        {t('Delete')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RemoveCategoryModal;
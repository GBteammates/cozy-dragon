import React from 'react';
import {
    Button, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import {IProduct} from "../models/IProduct";
import { useTranslation } from 'react-i18next';

interface RemoveProductModalProps {
    product: IProduct
    isOpen: boolean,
    onClose: () => void,
    onRemoveProduct: (id: string) => void
}

const RemoveProductModal = (props: RemoveProductModalProps) => {
    const {product, isOpen, onClose, onRemoveProduct} = props;
    const {t} = useTranslation();
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.16)'}}/>
            <ModalContent borderRadius='2xl'>
                <ModalHeader borderBottom='1px solid' borderBottomColor='gray.200'>
                    {t('Delete the item')}
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody my={4}>
                    <Text>{t('Are you sure you want to delete the item')}<b>{product.title}</b></Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={() => onRemoveProduct(product.id)}>
                        {t('Delete')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RemoveProductModal;
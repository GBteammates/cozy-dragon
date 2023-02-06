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

interface RemoveProductModalProps {
    product: IProduct
    isOpen: boolean,
    onClose: () => void,
    onRemoveProduct: (id: string) => void
}

const RemoveProductModal = ({product, isOpen, onClose, onRemoveProduct}: RemoveProductModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.16)'}}/>
            <ModalContent borderRadius='2xl'>
                <ModalHeader borderBottom='1px solid' borderBottomColor='gray.200'>Удалить товар</ModalHeader>
                <ModalCloseButton/>
                <ModalBody my={4}>
                    <Text>Вы уверены, что хотите удалить товар <b>{product.title}</b></Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        Отмена
                    </Button>
                    <Button onClick={() => onRemoveProduct(product.id)}>Удалить</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RemoveProductModal;
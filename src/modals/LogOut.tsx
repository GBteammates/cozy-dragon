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

interface LogOutProps {
    isOpen: boolean,
    onClose: () => void,
    logOutHandler: () => void
}

const LogOut = ({isOpen, onClose, logOutHandler}: LogOutProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.7)'}}/>
            <ModalContent>
                <ModalHeader borderBottom='1px solid' borderBottomColor='gray.200'>Выход из аккаунта</ModalHeader>
                <ModalCloseButton/>
                <ModalBody py={6}>
                    <Text>Вы действительно хотите выйти из аккаунта?</Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        Отмена
                    </Button>
                    <Button onClick={logOutHandler}>Выйти</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default LogOut;
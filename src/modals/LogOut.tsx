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
import { useTranslation } from 'react-i18next';

interface LogOutProps {
    isOpen: boolean,
    onClose: () => void,
    logOutHandler: () => void
}

const LogOut = (props: LogOutProps) => {
    const {isOpen, onClose, logOutHandler} = props;
    const {t} = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.7)'}}/>
            <ModalContent>
                <ModalHeader borderBottom='1px solid' borderBottomColor='gray.200'>
                    {t('Logout')}
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody py={6}>
                    <Text>
                        {t('Are you sure you want to log out of your account?')}
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={logOutHandler}>
                        {t('Log out')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default LogOut;
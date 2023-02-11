import React from 'react';
import {Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay} from '@chakra-ui/react';
import {ICustomer} from "../models/ICustomer";
import SignInByEmailForm from "../components/auth/SignInByEmailForm";

interface SignInProps {
    isOpen: boolean,
    onClose: () => void,
    onOpenSignUp: () => void,
    signInByEmail: (data: Partial<ICustomer>) => void
}

const SignIn = ({isOpen, onClose, onOpenSignUp, signInByEmail}: SignInProps) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay style={{backgroundColor: 'RGBA(0, 0, 0, 0.7)'}}/>
            <ModalContent borderRadius='2xl'>
                <ModalHeader borderBottom='1px solid' borderBottomColor='gray.200'>Войти</ModalHeader>
                <ModalCloseButton/>
                <ModalBody mt={4} textAlign='center'>
                    <SignInByEmailForm signInByEmail={signInByEmail}/>
                    <Button w='100%' mt={4} mb={8} colorScheme='gray' variant='outline' onClick={() => {
                        onClose();
                        onOpenSignUp()
                    }}>
                        Создать аккаунт
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SignIn;
import React from 'react';
import {Alert, AlertDescription, AlertIcon, AlertTitle} from "@chakra-ui/react";

interface ErrorMessageProps {
    message: string;
    borderRadius?: string
}

const ErrorMessage = ({message, borderRadius}: ErrorMessageProps) => {
    return (
        <Alert status='error' borderRadius={borderRadius} minH='48px'>
            <AlertIcon/>
            <AlertTitle>Ошибка:</AlertTitle>
            <AlertDescription fontSize='sm'>{message}</AlertDescription>
        </Alert>
    );
};

export default ErrorMessage;
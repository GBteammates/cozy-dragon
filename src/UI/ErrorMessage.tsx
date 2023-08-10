import React from 'react';
import {Alert, AlertDescription, AlertTitle} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
    message: string;
    borderRadius?: string
}

const ErrorMessage = ({message, borderRadius}: ErrorMessageProps) => {
    const {t} = useTranslation();
    return (
        <Alert status='error' borderRadius={borderRadius} minH='48px'>
            <AlertTitle>{t('Error')}:</AlertTitle>
            <AlertDescription fontSize='sm'>{message}</AlertDescription>
        </Alert>
    );
};

export default ErrorMessage;
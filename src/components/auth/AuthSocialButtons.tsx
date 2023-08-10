import React from 'react';
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { useTranslation } from 'react-i18next';

interface AuthSocialButtonsProps {
    signInHandler: (source: string) => void
}

const AuthSocialButtons = ({signInHandler}: AuthSocialButtonsProps) => {
    const {t} = useTranslation();
    return (
        <Box textAlign='center'>
            <Text mb={3}>
                {t('Login with')}
            </Text>
            <Button size='lg' variant='outline' borderRadius='50%' p={0}
                    onClick={() => signInHandler('google')}>
                <Image h={7} src={'/assets/images/google-logo.svg'} alt='Google Icon'/>
            </Button>
        </Box>
    );
};

export default AuthSocialButtons;
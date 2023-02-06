import React from 'react';
import {Box, Button, Image, Text} from "@chakra-ui/react";

interface AuthSocialButtonsProps {
    signInHandler: (source: string) => void
}

const AuthSocialButtons = ({signInHandler}: AuthSocialButtonsProps) => {
    return (
        <Box textAlign='center'>
            <Text mb={3}>Войти с помощью</Text>
            <Button size='lg' variant='outline' borderRadius='50%' p={0}
                    onClick={() => signInHandler('google')}>
                <Image h={7} src={'/imgs/google-logo.svg'} alt='Google Icon'/>
            </Button>
        </Box>
    );
};

export default AuthSocialButtons;
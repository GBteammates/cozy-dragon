import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Button } from '@chakra-ui/react';

export const LangSwitcher = memo(() => {
    const {t, i18n} = useTranslation();

    const toggle = async () => {
        i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru');
    };

    return (
        <Button onClick={toggle}>
            {t('Language')}
        </Button>
    );
});

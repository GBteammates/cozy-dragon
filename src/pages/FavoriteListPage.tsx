import React from 'react';
import MainBlockLayout from '../UI/MainBlockLayout';
import FavoritesList from '../components/favorites/FavoritesList';
import { useTranslation } from 'react-i18next';

export const FavoriteListPage = () => {
    const {t} = useTranslation();
    return (
        <MainBlockLayout title={t('Favorites')}>
            <FavoritesList/>
        </MainBlockLayout>
    );
};
import React from 'react';
import MainBlockLayout from '../UI/MainBlockLayout';
import FavoritesList from '../components/favorites/FavoritesList';

export const Favorites = () => {
    return (
        <MainBlockLayout title={'Избранное'}>
            <FavoritesList/>
        </MainBlockLayout>
    );
};
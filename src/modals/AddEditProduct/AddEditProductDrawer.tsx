import React from 'react';
import {
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from "@chakra-ui/react";
import { IProduct } from "../../models/IProduct";
import { useTranslation } from 'react-i18next';
import { AddEditProductForm } from './AddEditProductForm';

export interface Values {
    title: string;
    price: number;
    description: string;
    categoryId: number;
    image: string[];
    vendor: string
}

interface AddEditProductDrawerProps {
    isEdit: boolean,
    product?: IProduct,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (values: any) => void
}

const AddEditProductDrawer = (props: AddEditProductDrawerProps) => {
    const {
        isEdit,
        product = {} as IProduct,
        isOpen,
        onClose,
        onSubmit
    } = props;
    const {t} = useTranslation();

    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
        >
            <DrawerOverlay backdropFilter='blur(2px)'/>
            <DrawerContent minWidth='500px'>
                <DrawerCloseButton/>
                <DrawerHeader borderBottomWidth='1px' backgroundColor='gray.100' boxShadow='md' minH='80px'
                              display='flex' alignItems='center'>
                    {isEdit ? t('The item editing') : t('Adding a new item')}
                </DrawerHeader>
                <AddEditProductForm product={product} onSubmit={onSubmit} onClose={onClose}/>
            </DrawerContent>
        </Drawer>
    );
};

export default AddEditProductDrawer;
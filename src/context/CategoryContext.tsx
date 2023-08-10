import React, { ReactNode, useContext, useState } from 'react';
import { ICategory } from '../models/ICategory';

type CategoryProviderProps = {
    children: ReactNode
}

type CategoryContextProps = {
    currentCategory: ICategory,
    categories: ICategory[],
    onChangeCurrentCategory: (value: ICategory) => void
    onChangeCategories: (value: ICategory[]) => void
}

const CategoryContext = React.createContext({} as CategoryContextProps);

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({children}: CategoryProviderProps) => {
    const [currentCategory, setCurrentCategory] = useState<ICategory>({} as ICategory);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const onChangeCurrentCategory = (value: ICategory) => {
        setCurrentCategory(value);
    };
    const onChangeCategories = (value: ICategory[]) => {
        setCategories(value);
    };

    return (
        <CategoryContext.Provider
            value={{
                currentCategory,
                categories,
                onChangeCurrentCategory,
                onChangeCategories
            }}>
            {children}
        </CategoryContext.Provider>
    )
}

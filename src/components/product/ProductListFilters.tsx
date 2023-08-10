import React from 'react';
import { Flex, IconButton, Input, InputGroup, InputRightElement, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';

interface ProductListFiltersProps {
    sortOrder: string;
    searchQuery: string;
    handleSortOrderChange: (value: string) => void;
    handleSearchQueryChange: (value: string) => void;
}

const ProductListFilters = (props: ProductListFiltersProps) => {
    const {sortOrder, searchQuery, handleSortOrderChange, handleSearchQueryChange} = props;
    const {t} = useTranslation();
    return (
        <Flex my={6} alignItems='center' gap={4}>
            <Select value={sortOrder}
                    borderRadius='2xl'
                    size='lg'
                    w='320px'
                    color='gray.500'
                    focusBorderColor={'yellow.500'}
                    placeholder={t('Sort')}
                    onChange={(e) => handleSortOrderChange(e.target.value)}>
                <option value='asc'>{t('Price low to high')}</option>
                <option value='desc'>{t('Price high to low')}</option>
            </Select>

            <InputGroup size='lg'>
                <Input
                    value={searchQuery}
                    pr='40px'
                    type='text'
                    placeholder={t('Search for items...')}
                    focusBorderColor={'yellow.500'}
                    borderRadius='2xl'
                    onChange={(e) => handleSearchQueryChange(e.target.value)}
                />
                {searchQuery.length > 0 &&
                    <InputRightElement justifyContent='flex-end'>
                        <IconButton size='lg' variant='link'
                                    aria-label='Clear' icon={<MdClose/>}
                                    onClick={() => {
                                        handleSearchQueryChange('');
                                    }}/>
                    </InputRightElement>
                }
            </InputGroup>
        </Flex>
    );
};

export default ProductListFilters;
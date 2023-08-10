import React from 'react';
import {IconButton} from "@chakra-ui/react";
import {MdModeEdit} from 'react-icons/md';

interface EditIconProps {
    onEdit: () => void
    isDisabled?: boolean
}

export const EditIcon = ({onEdit, isDisabled}: EditIconProps) => {
    return (
        <IconButton icon={<MdModeEdit/>}
                    aria-label='Edit'
                    backgroundColor='white'
                    color='gray.500'
                    border='1px solid'
                    borderColor='gray.300'
                    borderRadius='50%'
                    fontSize='x-large'
                    _hover={{color: 'yellow.500', boxShadow: 'lg'}}
                    _focus={{boxShadow: 'none'}}
                    isDisabled={isDisabled}
                    onClick={() => onEdit()}
        />
    );
};

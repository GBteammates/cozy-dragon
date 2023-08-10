import {IconButton} from '@chakra-ui/react';
import React from 'react';
import {MdDone} from "react-icons/md";

interface SaveIconProps {
    onSave: () => void
    isDisabled?: boolean
}

export const SaveIcon = ({onSave, isDisabled}: SaveIconProps) => {
    return (
        <IconButton icon={<MdDone/>}
                    aria-label='Save'
                    colorScheme='yellow'
                    border='1px solid'
                    borderColor='gray.300'
                    borderRadius='50%'
                    fontSize='xx-large'
                    disabled={isDisabled}
                    _focus={{boxShadow: 'none'}}
                    onClick={onSave}/>
    );
}


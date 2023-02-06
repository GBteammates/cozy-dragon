import React from 'react';
import {Icon} from "@chakra-ui/react";
import {MdArrowBackIosNew} from "react-icons/md";
import {Link} from "react-router-dom";
import {useCategory} from "../context/CategoryContext";
import {slashEscape} from "../utilities/RegExpURL";

interface GoBackLinkProps {
    link?: string
    linkTitle?: string
}

export const GoBackLink = ({link, linkTitle}: GoBackLinkProps) => {
    const {currentCategory} = useCategory();
    return (
        <Link to={link ? link : `/${slashEscape(currentCategory?.name) ?? ''}`}
              style={{color: 'gray', display: 'flex', alignItems: 'center', marginLeft: '-20px'}}>
            <Icon as={MdArrowBackIosNew} mr={1}/>{linkTitle ? linkTitle : 'Вернуться в каталог'}
        </Link>
    );
};
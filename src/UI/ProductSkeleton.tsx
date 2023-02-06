import React from 'react';
import {Flex, Skeleton, SkeletonText, Spacer} from "@chakra-ui/react";

const ProductSkeleton = () => {
    return (
        <Flex
            bg='gray.100'
            rounded='2xl'
            padding='4'
            maxW='300px'
            w='100%'
            minWidth='250px'
            height='475px'
            flexDirection='column'
        >
            <Skeleton height='250px'/>
            <SkeletonText mt='4' noOfLines={4} spacing='4'/>
            <Spacer/>
            <Skeleton height='40px' mt={8} borderRadius='2xl'/>
        </Flex>
    );
};

export default ProductSkeleton;
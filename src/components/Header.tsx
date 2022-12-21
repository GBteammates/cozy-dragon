import React, {useState} from 'react';
import {
    Avatar,
    Button,
    Flex,
    HStack,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {useCategory} from "../context/CategoryContext";
import {ICategory} from '../models/ICategory';
import axios from "axios";
import {ToastError, ToastSuccess} from "../utilities/error-handling";
import SignIn from '../modals/SignIn';
import SignUp from "../modals/SignUp";
import {ICustomer} from "../models/ICustomer";
import {Links} from './cart/Links';
import {isAdmin} from '../constants/isAdmin';

export const Header = () => {
    const {onChangeCurrentCategory} = useCategory();

    const [isAuth, setIsAuth] = useState(false);
    const [customer, setCustomer] = useState({} as ICustomer);
    const signInDisclosure = useDisclosure();
    const signUpDisclosure = useDisclosure();

    const signInBySocial = async (source: string) => {
        await axios.get(
            `/user/login/${source}`
        )
            .then(({data}) => {
                console.log(data);
                ToastSuccess('Вы успешно авторизовались');
                setIsAuth(true);
            })
            .catch(error => {
                ToastError(error.message);
            })
            .finally(() => {
                signInDisclosure.onClose();
            })
    }

    const signInByEmail = async ({email, password}: ICustomer) => {
        await axios.post(
            `https://api.escuelajs.co/api/v1/auth/login`, {
                email, password
            }
        )
            .then(({data}) => {
                ToastSuccess('Вы успешно авторизовались');
                setIsAuth(true);
                localStorage.setItem('token', data.access_token);
            })
            .catch(error => {
                ToastError(error.message);
            })
            .finally(() => {
                signInDisclosure.onClose();
            })
    }
    const signUpHandler = async ({name, email, password}: ICustomer) => {
        await axios.post(
            `https://api.escuelajs.co/api/v1/users/`, {
                name, email, password,
                avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Missing_avatar.svg'
            }
        )
            .then(({data}) => {
                setCustomer(data)
                ToastSuccess('Вы успешно зарегистрировались');
                setIsAuth(true);
            })
            .catch(error => {
                ToastError(error.message);
            })
            .finally(() => {
                signUpDisclosure.onClose();
            })
    }

    const logOutHandler = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
    }

    return (
        <Flex bg='gray.100'
              position='sticky'
              top='0'
              left='0'
              w='100%'
              height='80px'
              padding={5}
              boxShadow='md'
              alignItems='center'
              justifyContent='space-between'
              zIndex={100}
        >
            <Link to='/all' onClick={() => onChangeCurrentCategory({} as ICategory)}>
                <Flex alignItems='center' color='gray.500' textTransform={"uppercase"} ml={4}>
                    <svg width="52" height="52"
                         xmlns="http://www.w3.org/2000/svg">
                        <image href="/imgs/logo.svg" height="52" width="52"/>
                    </svg>
                    <Text ml={2} as='h1' fontSize='4xl' fontWeight='thin' textTransform='lowercase'>
                        store
                    </Text>
                </Flex>
            </Link>
            <Flex alignItems={'center'}>
                {!isAuth && <HStack>
                    <Button onClick={signInDisclosure.onOpen} backgroundColor='gray.300' px={6}>Войти</Button>
                    <Button onClick={signUpDisclosure.onOpen} colorScheme={"yellow"} px={6}>Регистрация</Button>
                </HStack>}

                {isAuth && <>
                    <HStack
                        as={'nav'}
                        spacing={2}
                        marginX={6}
                        fontSize='25px'>
                        {!isAdmin && Links.map(({title, icon, path}) => (
                            <Link to={path} key={title}>
                                {icon}
                            </Link>
                        ))}
                    </HStack>
                    <Menu>
                        <MenuButton
                            as={Button}
                            rounded={'full'}
                            variant={'link'}
                            cursor={'pointer'}
                            minW={0}>
                            <Avatar
                                size={'md'}
                                src={customer?.avatar}
                                border='1px solid'
                                borderColor='gray.400'
                            />
                        </MenuButton>
                        <MenuList>
                            {!isAdmin && isAuth && <MenuItem>Мои заказы</MenuItem>}
                            {isAuth && <MenuDivider/>}
                            {isAuth && <MenuItem onClick={() => logOutHandler()}>Выйти</MenuItem>}
                        </MenuList>
                    </Menu>
                </>}
            </Flex>

            <SignIn isOpen={signInDisclosure.isOpen}
                    onClose={signInDisclosure.onClose}
                    onOpenSignUp={signUpDisclosure.onOpen}
                    signInHandler={signInBySocial}
                    signInByEmail={signInByEmail}/>
            <SignUp isOpen={signUpDisclosure.isOpen}
                    onClose={signUpDisclosure.onClose}
                    onOpenSignIn={signInDisclosure.onOpen}
                    signUpHandler={signUpHandler}/>
        </Flex>
    );
}
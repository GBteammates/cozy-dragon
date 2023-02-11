import React, {useEffect, useState} from 'react';
import {
    Button,
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import {Link, useNavigate} from 'react-router-dom';
import {useCategory} from "../context/CategoryContext";
import {ICategory} from '../models/ICategory';
import axios from "axios";
import {ToastError, ToastSuccess} from "../utilities/error-handling";
import SignIn from '../modals/SignIn';
import SignUp from "../modals/SignUp";
import {ICustomer} from "../models/ICustomer";
import {Links} from './cart/Links';
import {rootURL} from '../constants/URLs';
import EditProfileModal from '../modals/EditProfileModal';
import LogOut from '../modals/LogOut';

import {
    getCartId,
    removeCartId,
    removeToken,
    removeUserId,
    setCartId,
    setToken,
    setUserId
} from "../utilities/local-storage-handling";
import {useCustomer} from "../context/CustomerContext";
import {useCart} from "../context/CartContext";
import SettingsModal from "../modals/SettingsModal";
import {IRole} from "../models/IRole";
import {BsFillPersonFill} from 'react-icons/bs';
import {getHeaderConfig} from "../utilities/getHeaderConfig";
import OrderService from "../api/OrderService";

export const Header = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState<IRole[]>([]);
    const signInDisclosure = useDisclosure();
    const signUpDisclosure = useDisclosure();
    const logOutDisclosure = useDisclosure();
    const editProfileDisclosure = useDisclosure();
    const settingsDisclosure = useDisclosure();
    const {onFetchCart, onEmptyCartContext} = useCart();
    const {onChangeCurrentCategory} = useCategory();
    const {customer, onChangeCustomer, onChangeAdmin, isAdmin, isAuth, onChangeAuth} = useCustomer();
    const navigate = useNavigate();

    useEffect(() => {
        const cartId = getCartId();
        if (isAuth) {
            getUserWithSession();
            if (cartId) {
                onFetchCart(cartId);
            }
        } else {
            navigate('');
        }
    }, [])

    const signInBySocial = async (source: string) => {
        await axios.get(
            `${rootURL}/user/login/${source}`
        )
            .then(({data}) => {
                ToastSuccess('Вы успешно авторизовались');
                setToken(data.token.access_token);
                onFetchCart(data.cartId);
                setCartId(data.cartId);
                onChangeAuth(true);
            })
            .catch(error => {
                ToastError(error.message);
            })
            .finally(() => {
                signInDisclosure.onClose();
            })
    }

    const signInByEmail = async ({firstname, email, password}: Partial<ICustomer>) => {
        setIsLoading(true);
        await axios.post(
            `${rootURL}/user/login`, {
                firstname, email, password
            }
        )
            .then(({data}) => {
                ToastSuccess('Вы успешно авторизовались');
                setToken(data.token.access_token);
                onFetchCart(data.cartId);
                setCartId(data.cartId);
                onChangeAuth(true);
                getUserWithSession();
            })
            .catch(error => {
                if (error.response.data?.message?.includes('incorrect email or password')) {
                    ToastError('Неверный логин или пароль');
                } else {
                    ToastError('Сервис временно недоступен');
                }
            })
            .finally(() => {
                signInDisclosure.onClose();
            })
    }

    const signUpHandler = async ({firstname, email, password}: Partial<ICustomer>) => {
        await axios.post(
            `${rootURL}/user/create`, {
                firstname, email, password
            }
        )
            .then(() => {
                ToastSuccess('Вы успешно зарегистрировались');
            })
            .catch(error => {
                ToastError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
                signUpDisclosure.onClose();
            })
    }
    const logOutHandler = async () => {
        await axios.get(
            `${rootURL}/user/logout?id=${customer.id}`,
        )
            .then(() => {
                onChangeCustomer({} as ICustomer);
                onChangeAuth(false);
                onChangeAdmin(false);
                onEmptyCartContext();
                removeCartId();
                removeToken();
                removeUserId();
                navigate('');
                ToastSuccess('Вы вышли из аккаунта');
            })
            .catch(error => {
                ToastError('Сервис временно недоступен');
            })
            .finally(() => {
                logOutDisclosure.onClose();
            })
    }

    const getUserWithSession = async () => {
        const config = getHeaderConfig();
        await axios.get(`${rootURL}/user/profile`, config)
            .then(({data}) => {
                onChangeCustomer(data);
                setUserId(data.id);
                if (data.rights?.name?.toLowerCase() === 'admin') {
                    onChangeAdmin(true);
                }
                onChangeAuth(true);
            })
            .catch(error => {
                ToastError('Сервис временно недоступен');
                removeToken();
                removeUserId();
                onChangeAuth(false);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const onEditProfile = async (values: ICustomer) => {
        const config = getHeaderConfig();
        await axios.put(
            `${rootURL}/user/profile/edit`, values, config
        )
            .then(({data}) => {
                onChangeCustomer(data);
                setUserId(data.id);
                ToastSuccess('Ваши данные были успешно изменены');
            })
            .catch(error => {
                ToastError(error.message);
            })
            .finally(() => {
                editProfileDisclosure.onClose();
            })
    }

    const onOpenSettingsModal = async () => {
        const config = getHeaderConfig();
        await axios.get(
            `${rootURL}/user/rights/list`, config
        ).then(({data}) => {
            setRoles(data);
            settingsDisclosure.onOpen();
        })
    }

    const onEditUserRole = async (values: any) => {
        const config = getHeaderConfig();
        await axios.put(
            `${rootURL}/user/role/update`, values, config
        )
            .then(() => {
                ToastSuccess('Роль пользователя была успешно изменена');
            })
            .catch(error => {
                ToastError(error.message);
            })
            .finally(() => {
                settingsDisclosure.onClose();
            })
    }

    const onEditOrderStatus = async (values: any) => {
        try {
            const config = getHeaderConfig();
            await OrderService.changeOrderStatus(values, config);
            ToastSuccess('Статус заказа был изменен');
            settingsDisclosure.onClose();
        } catch (e: any) {
            ToastError(e?.message);
        }
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
            <Link to='' onClick={() => onChangeCurrentCategory({} as ICategory)}>
                <Flex alignItems='center' color='gray.500' textTransform={"uppercase"} ml={4}>
                    <svg width="52" height="52"
                         xmlns="http://www.w3.org/2000/svg">
                        <image href="/imgs/logo.png" height="52" width="52"/>
                    </svg>
                    <Text ml={2} as='h1' fontSize='3xl' fontWeight='thin' textTransform='lowercase'>
                        Cozy Dragon
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
                        mx={2}
                        fontSize='25px'>
                        {isAdmin && <Text ml={2} fontSize='2xl' fontWeight='thin' color='gray'>
                            Панель администратора
                        </Text>}
                        {!isAdmin && Links.map(({title, icon, path}) => (
                            <Link to={path} key={title}>
                                {icon}
                            </Link>
                        ))}
                    </HStack>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label='Профиль'
                            icon={<BsFillPersonFill fontSize='xx-large'/>}
                        />
                        <MenuList>
                            <MenuItem onClick={editProfileDisclosure.onOpen}>Профиль</MenuItem>
                            {isAdmin && <MenuItem onClick={onOpenSettingsModal}>Настройки</MenuItem>}
                            {!isAdmin &&
                                <Link to={'/orders'}>
                                    <MenuItem>Мои заказы</MenuItem>
                                </Link>
                            }
                            <MenuDivider/>
                            <MenuItem onClick={() => logOutHandler()}>Выйти</MenuItem>
                        </MenuList>
                    </Menu>
                </>}
            </Flex>

            <EditProfileModal customer={customer}
                              isOpen={editProfileDisclosure.isOpen}
                              onClose={editProfileDisclosure.onClose}
                              onEditProfile={onEditProfile}/>
            <SettingsModal roles={roles}
                           isOpen={settingsDisclosure.isOpen}
                           onClose={settingsDisclosure.onClose}
                           onEditUserRole={onEditUserRole}
                           onEditOrderStatus={onEditOrderStatus}/>

            <SignIn isOpen={signInDisclosure.isOpen}
                    onClose={signInDisclosure.onClose}
                    onOpenSignUp={signUpDisclosure.onOpen}
                    signInByEmail={signInByEmail}/>
            <SignUp isOpen={signUpDisclosure.isOpen}
                    onClose={signUpDisclosure.onClose}
                    onOpenSignIn={signInDisclosure.onOpen}
                    signUpHandler={signUpHandler}/>
            <LogOut isOpen={logOutDisclosure.isOpen}
                    onClose={logOutDisclosure.onClose}
                    logOutHandler={logOutHandler}/>
        </Flex>
    );
}
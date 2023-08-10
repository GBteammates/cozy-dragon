import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Flex,
    HStack,
    IconButton,
    Image,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategory } from '../../context/CategoryContext';
import { ICategory } from '../../models/ICategory';
import axios from 'axios';
import { ToastError, ToastSuccess } from '../../utilities/error-handling';
import SignIn from '../../modals/SignIn';
import SignUp from '../../modals/SignUp';
import { ICustomer } from '../../models/ICustomer';
import { Links } from '../cart/Links';
import { rootURL } from '../../constants/URLs';
import EditProfileModal from '../../modals/EditProfileModal';
import LogOut from '../../modals/LogOut';

import {
    getCartId,
    removeCartId,
    removeToken,
    removeUserId,
    setCartId,
    setToken,
    setUserId
} from '../../utilities/local-storage-handling';
import { useCustomer } from '../../context/CustomerContext';
import { useCart } from '../../context/CartContext';
import SettingsModal from '../../modals/SettingsModal';
import { IRole } from '../../models/IRole';
import { BsFillPersonFill } from 'react-icons/bs';
import { getHeaderConfig } from '../../utilities/getHeaderConfig';
import OrderService from '../../api/OrderService';
import { LangSwitcher } from '../../UI/LangSwitcher';
import { useTranslation } from 'react-i18next';

export const Header = () => {
    const {t} = useTranslation();
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
    }, [isAuth])

    const signInBySocial = async (source: string) => {
        await axios.get(
            `${rootURL}/user/login/${source}`
        )
            .then(({data}) => {
                ToastSuccess(t('You have successfully logged in'));
                setToken(data.token.access_token);
                onFetchCart(data.cartId);
                setCartId(data.cartId);
                onChangeAuth(true);
                signInDisclosure.onClose();
            })
            .catch(error => {
                ToastError(error.message);
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
                ToastSuccess(t('You have successfully logged in'));
                setToken(data.token.access_token);
                onFetchCart(data.cartId);
                setCartId(data.cartId);
                onChangeAuth(true);
                getUserWithSession();
                signInDisclosure.onClose();
            })
            .catch(error => {
                if (error.response.data?.message?.includes('incorrect email or password')) {
                    ToastError(t('Wrong login or password'));
                } else {
                    ToastError(t('Service is temporarily unavailable'));
                }
            })
    }

    const signUpHandler = async ({firstname, lastname, email, password}: Partial<ICustomer>) => {
        await axios.post(
            `${rootURL}/user/create`, {
                firstname, lastname, email, password
            }
        )
            .then(() => {
                ToastSuccess(t('You have successfully signed up'));
                signUpDisclosure.onClose();
            })
            .catch(error => {
                ToastError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
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
                ToastSuccess(t('You are logged out'));
            })
            .catch(error => {
                ToastError(t('Service is temporarily unavailable'));
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
                ToastError(t('Service is temporarily unavailable'));
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
                ToastSuccess(t('Your data has been successfully changed'));
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

    const onEditUserRole = useCallback(async (values: any) => {
        const config = getHeaderConfig();
        await axios.put(
            `${rootURL}/user/role/update`, values, config
        )
            .then(() => {
                ToastSuccess(t('User role has been successfully changed'));
            })
            .catch(error => {
                ToastError(error.message);
            })
            .finally(() => {
                settingsDisclosure.onClose();
            })
    }, [settingsDisclosure, t]);

    const onEditOrderStatus = async (values: any) => {
        try {
            const config = getHeaderConfig();
            await OrderService.changeOrderStatus(values, config);
            ToastSuccess(t('Order status has been changed'));
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
                <Flex alignItems='center' color='gray.500' textTransform={'uppercase'} ml={4}>
                    <Image
                        h='52px'
                        w='52px'
                        objectFit={'contain'}
                        src='/assets/images/logo.png'/>
                    <Text ml={2} as='h1' fontSize='3xl' fontWeight='thin' textTransform='lowercase'>
                        Cozy Dragon
                    </Text>
                </Flex>
            </Link>
            <Flex alignItems={'center'}>
                <LangSwitcher/>
                {!isAuth && <HStack>
                    <Button onClick={signInDisclosure.onOpen} backgroundColor='gray.300' px={6}>
                        {t('Sign in')}
                    </Button>
                    <Button onClick={signUpDisclosure.onOpen} colorScheme={'yellow'} px={6}>
                        {t('Sign up')}
                    </Button>
                </HStack>}

                {isAuth && <>
                    <HStack
                        as={'nav'}
                        spacing={2}
                        mx={2}
                        fontSize='25px'>
                        {isAdmin && <Text ml={2} fontSize='2xl' fontWeight='thin' color='gray'>
                            {t('Admin panel')}
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
                            aria-label='Profile'
                            icon={<BsFillPersonFill fontSize='xx-large'/>}
                        />
                        <MenuList>
                            <MenuItem onClick={editProfileDisclosure.onOpen}>
                                {t('Profile')}
                            </MenuItem>
                            {isAdmin && (
                                <MenuItem onClick={onOpenSettingsModal}>
                                    {t('Settings')}
                                </MenuItem>
                            )}
                            {!isAdmin && (
                                <Link to={'/orders'}>
                                    <MenuItem>{t('My orders')}</MenuItem>
                                </Link>
                            )}
                            <MenuDivider/>
                            <MenuItem onClick={logOutDisclosure.onOpen}>
                                {t('Log out')}
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </>}
            </Flex>

            <EditProfileModal
                customer={customer}
                isOpen={editProfileDisclosure.isOpen}
                onClose={editProfileDisclosure.onClose}
                onEditProfile={onEditProfile}/>
            <SettingsModal
                roles={roles}
                isOpen={settingsDisclosure.isOpen}
                onClose={settingsDisclosure.onClose}
                onEditUserRole={onEditUserRole}
                onEditOrderStatus={onEditOrderStatus}/>
            <SignIn
                isOpen={signInDisclosure.isOpen}
                onClose={signInDisclosure.onClose}
                onOpenSignUp={signUpDisclosure.onOpen}
                signInByEmail={signInByEmail}/>
            <SignUp
                isOpen={signUpDisclosure.isOpen}
                onClose={signUpDisclosure.onClose}
                onOpenSignIn={signInDisclosure.onOpen}
                signUpHandler={signUpHandler}/>
            <LogOut
                isOpen={logOutDisclosure.isOpen}
                onClose={logOutDisclosure.onClose}
                logOutHandler={logOutHandler}/>
        </Flex>
    );
}
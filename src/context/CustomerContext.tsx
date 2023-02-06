import React, {ReactNode, useContext, useState} from "react";
import {ICustomer} from "../models/ICustomer";
import {getToken} from "../utilities/local-storage-handling";

type CustomerProviderProps = {
    children: ReactNode
}

type CustomerContextProps = {
    customer: ICustomer,
    isAdmin: boolean,
    isAuth: boolean,
    onChangeCustomer: (value: ICustomer) => void,
    onChangeAdmin: (value: boolean) => void,
    onChangeAuth: (value: boolean) => void
}

const CustomerContext = React.createContext({} as CustomerContextProps);

export const useCustomer = () => useContext(CustomerContext);

export const CustomerProvider = ({children}: CustomerProviderProps) => {
    const [customer, setCustomer] = useState<ICustomer>({} as ICustomer);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuth, setIsAuth] = useState(!!getToken());

    const onChangeCustomer = (value: ICustomer) => {
        setCustomer(value);
    };

    const onChangeAdmin = (value: boolean) => {
        setIsAdmin(value);
    }
    const onChangeAuth = (value: boolean) => {
        setIsAuth(value);
    }

    return (
        <CustomerContext.Provider
            value={{
                customer,
                isAdmin,
                isAuth,
                onChangeCustomer,
                onChangeAdmin,
                onChangeAuth
            }}>
            {children}
        </CustomerContext.Provider>
    )
}

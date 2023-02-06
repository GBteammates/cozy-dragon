export interface ICustomer {
    id: string,
    password?: string,
    rights?: IRights
    address?: IAddress,
    email?: string
    firstname?: string,
    lastname?: string,
}

export interface IAddress {
    city?: string,
    country?: string,
    street?: string
    zipcode?: string,
}

export interface IRights {
    id: string,
    name: string,
    rules: any
}
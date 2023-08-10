export type IRole = {
    id: string,
    name: 'Admin' | 'Customer',
    rules: string[]
}
import axios, {AxiosResponse} from "axios";
import {rootURL} from "../constants/URLs";
import {IProduct} from "../models/IProduct";

export default class ProductService {
    static async getPaginatedProducts(offset: number, limit: number, config: any, sortOrder: string = 'asc', sortType: string = 'price'): Promise<AxiosResponse<IProduct[]>> {
        return axios.get<IProduct[]>(`${rootURL}/items/list?sortType=${sortType}&sortOrder=${sortOrder}&offset=${offset}&limit=${limit}`, config)
    }
    static async getProduct(id: string, config: any): Promise<AxiosResponse<IProduct>> {
        return axios.get<IProduct>(`${rootURL}/items/${id}`, config)
    }
    static async getAllProductsByCategory(name: string, offset: number, limit: number, config: any, sortOrder: string = 'asc', sortType: string = 'price'): Promise<AxiosResponse> {
        return axios.get(`${rootURL}/items/?param=${name}&sortType=${sortType}&sortOrder=${sortOrder}&offset=${offset}&limit=${limit}`, config)
    }
    static async getProductsBySearchQuery(searchQuery: string = '', offset: number, limit: number, config: any, sortOrder: string = 'asc', sortType: string = 'price'): Promise<AxiosResponse> {
        return axios.get(`${rootURL}/items/search/?param=${searchQuery}&sortType=${sortType}&sortOrder=${sortOrder}&offset=${offset}&limit=${limit}`, config)
    }
    static async createProduct(product: any, config: any): Promise<AxiosResponse> {
        return axios.post<IProduct>(`${rootURL}/items/create`, product, config)
    }
    static async updateProduct(product: any, config: any): Promise<AxiosResponse> {
        return axios.put<IProduct>(`${rootURL}/items/update`, product, config)
    }
    static async deleteProduct(id: string, config: any): Promise<AxiosResponse> {
        return axios.delete<IProduct>(`${rootURL}/items/delete/${id}`, config)
    }
    static async getFavoriteProducts(userID: string, limit: number, offset: number, config: any): Promise<AxiosResponse> {
        return axios.get(`${rootURL}/items/favList/?param=${userID}&offset=${offset}&limit=${limit}`, config)
    }
    static async addFavoriteProduct(userId: string, itemId: string, config: any): Promise<AxiosResponse> {
        return axios.post(`${rootURL}/items/addFavItem`, {userId: userId, itemId: itemId}, config)
    }
    static async deleteFavoriteProduct(userId: string, itemId: string, config: any): Promise<AxiosResponse> {
        return axios.delete(`${rootURL}/items/deleteFav/${userId}/${itemId}`, config)
    }
}
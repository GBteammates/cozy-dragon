import axios, {AxiosResponse} from "axios";
import { rootURL } from "../constants/URLs";
import {ICategory} from "../models/ICategory";

export default class CategoryService {
    static async getCategories(): Promise<AxiosResponse<ICategory[]>> {
        return axios.get<ICategory[]>(`${rootURL}/categories/list`)
    }
    static async createCategory(category: Partial<ICategory>, config: any): Promise<AxiosResponse<ICategory>> {
        return axios.post<ICategory>(`${rootURL}/categories/create`, category, config)
    }
    static async updateCategory(id: number, category: Partial<ICategory>, config: any): Promise<AxiosResponse<ICategory>> {
        return axios.put<ICategory>(`${rootURL}/categories/${id}`, category, config)
    }
    static async deleteCategory(id: number, config: any): Promise<AxiosResponse> {
        return axios.delete<ICategory>(`${rootURL}/categories/delete/${id}`, config)
    }
}
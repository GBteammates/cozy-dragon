import axios, {AxiosResponse} from "axios";
import {rootURL} from "../constants/URLs";
import {IEditOrderStatus, IOrder} from "../models/IOrder";

export default class OrderService {
    static async getOrders(userId: string, config: any): Promise<AxiosResponse> {
        return axios.get(`${rootURL}/order/list/${userId}`, config)
    }
    static async getOrderById(orderId: string, config: any): Promise<AxiosResponse> {
        return axios.get(`${rootURL}/order/${orderId}`, config)
    }
    static async createOrder(order: IOrder, config: any): Promise<AxiosResponse> {
        return axios.post(`${rootURL}/order/create`, order, config)
    }
    static async changeOrderStatus(order: IEditOrderStatus, config: any): Promise<AxiosResponse> {
        return axios.patch(`${rootURL}/order/changestatus`, order, config)
    }
}

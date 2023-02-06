import { IRoute } from '../models/IRoute'
import * as pages from '../pages/index'

export enum RouteNames {
    HOME = '/',
    EDIT_PRODUCT = '/edit/:productId',
    ALL_PRODUCTS = '/all',
    CATEGORY = '/:currentCategory',
    PRODUCT = '/:categoryName/:productId',
    FAVOURITES = '/favorites',
    CART = '/cart',
    ORDERS = '/orders',
    ORDER = '/order/:orderId',
}

export const routes: IRoute[] = [
    { path: RouteNames.HOME, component: pages.Home },
    { path: RouteNames.ALL_PRODUCTS, component: pages.Home },
    { path: RouteNames.CATEGORY, component: pages.Home },
    { path: RouteNames.PRODUCT, component: pages.Product },
    { path: RouteNames.FAVOURITES, component: pages.Favorites },
    { path: RouteNames.CART, component: pages.Cart },
    { path: RouteNames.ORDERS, component: pages.OrderList },
    { path: RouteNames.ORDER, component: pages.Order }
]
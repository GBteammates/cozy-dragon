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
    { path: RouteNames.HOME, component: pages.HomePage },
    { path: RouteNames.ALL_PRODUCTS, component: pages.HomePage },
    { path: RouteNames.CATEGORY, component: pages.HomePage },
    { path: RouteNames.PRODUCT, component: pages.ProductPage },
    { path: RouteNames.FAVOURITES, component: pages.FavoriteListPage },
    { path: RouteNames.CART, component: pages.CartPage },
    { path: RouteNames.ORDERS, component: pages.OrderListPage },
    { path: RouteNames.ORDER, component: pages.OrderPage }
]
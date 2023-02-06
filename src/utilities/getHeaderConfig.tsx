import {getToken} from "./local-storage-handling";

export function getHeaderConfig() {
    const token = getToken();
    return token ? {headers: {Authorization: `Bearer ${token}`}} : {};
}
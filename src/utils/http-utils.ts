import {AuthUtils} from "./auth-utils";
import config from "../config/config";
import {ResultResponseType} from "../types/result-response.type";

export class HttpUtils {
    public static async request(url: string, method: string = 'GET', useAuth: boolean = true, body: any = null): Promise<ResultResponseType> {
        const result: ResultResponseType = {
            response: null,
            error: false
        };
        const params: any = {
            method: method,
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
            }
        };
        let token: string | null = <string | null>AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        if (useAuth && token) {
            params.headers["x-auth-token"] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response: Response;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }
        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    //токена нет
                    result.redirect = '/login';
                } else {
                    //токен устарел, надо обновить
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();

                    if (updateTokenResult) {
                        //делаем запрос повторно так как токены обновлены
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }
        return result;
    }
}
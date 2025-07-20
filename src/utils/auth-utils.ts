import config from "../config/config";
import {DefaultResponseType} from "../types/default-response.type";
import {TokensResponseType} from "../types/tokens-response.type";
import {AuthInfoType} from "../types/auth-info-type";

export class AuthUtils {
    public static readonly accessTokenKey: string = 'accessToken';
    public static readonly refreshTokenKey: string = 'refreshToken';
    public static readonly userInfoTokenKey: string = 'userInfo';

    public static setAuthInfo(authInfo: AuthInfoType): void {
        if (authInfo.accessToken && authInfo.refreshToken) {
            localStorage.setItem(this.accessTokenKey, authInfo.accessToken);
            localStorage.setItem(this.refreshTokenKey, authInfo.refreshToken);
        }
        if (authInfo.userInfo) {
            localStorage.setItem(this.userInfoTokenKey, authInfo.userInfo);
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    public static getAuthInfo(key: string | null): string | null | { [x: string]: string | null } {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);
        } else if (!key || ![this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return {
                [this.accessTokenKey]: localStorage.getItem((this.accessTokenKey)),
                [this.refreshTokenKey]: localStorage.getItem((this.refreshTokenKey)),
                [this.userInfoTokenKey]: localStorage.getItem((this.userInfoTokenKey)),
            }
        } else {
            return null;
        }
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | null = <string | null>this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {
                const tokens: DefaultResponseType | TokensResponseType = await response.json();
                if ((tokens as TokensResponseType)) {
                    this.setAuthInfo({
                        accessToken: (tokens as TokensResponseType).tokens.accessToken,
                        refreshToken: (tokens as TokensResponseType).tokens.refreshToken
                    } as AuthInfoType);
                    result = true;
                }
            }
        }
        if (!result) {
            this.removeAuthInfo();
        }
        return result;
    }
}
import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {ResultResponseType} from "../../types/result-response.type";

export class Logout {
    private readonly openNewRoute: Function;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }

    async logout(): Promise<void> {
        const result: ResultResponseType = await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.refreshTokenKey
        });

        if (result.error || !result.response) {
            return console.log(result.response.message);
        }

        AuthUtils.removeAuthInfo();
        this.openNewRoute('/login');
    }
}
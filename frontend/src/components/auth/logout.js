import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }

    async logout() {
        const result = await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.refreshTokenKey
        });

        if (result.error || !result.response) {
            console.log(result.response.message);
            return false;
        }

        AuthUtils.removeAuthInfo();
        this.openNewRoute('/login');
    }
}
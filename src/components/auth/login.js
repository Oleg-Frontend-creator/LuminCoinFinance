import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.findElements();
        this.processButtonElement.addEventListener('click', this.login.bind(this));
    }

    findElements() {
        this.emailElement = document.getElementById('emailInput');
        this.passwordElement = document.getElementById('passwordInput');
        this.rememberMeElement = document.getElementById('rememberMe');
        this.processButtonElement = document.getElementById('process-btn');
    }

    validate() {
        let isError = false;
        if (this.emailElement.value && this.emailElement.value.match(/^\S+@\S+\.\S+$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            isError = true;
            this.emailElement.classList.add('is-invalid');
        }
        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            isError = true;
            this.passwordElement.classList.add('is-invalid');
        }

        return !isError;
    }

    async login() {
        if (this.validate()) {
            const result = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            });

            if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken
                || !result.response.tokens.refreshToken || !result.response.user.name || !result.response.user.lastName
                || !result.response.user.id))) {
                console.log(result.response.message)
                return false;
            }
            AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken,
                JSON.stringify({
                    id: result.response.user.id,
                    name: result.response.user.name,
                    lastName: result.response.user.lastName
                }));

            await this.getUserBalance(AuthUtils.getAuthInfo(AuthUtils.accessTokenKey), AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey));

            this.openNewRoute('/');
        }
    }

    async getUserBalance(accessToken, refreshToken) {
        const result = await HttpUtils.request('/balance', 'GET', true);

        if (result.error || !result.response) {
            console.log(result.response.message)
            return false;
        }

        const userInfo = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey));
        if (userInfo) {
            userInfo.balance = result.response.balance;
            AuthUtils.setAuthInfo(accessToken, refreshToken, JSON.stringify(userInfo));
        }
    }
}
import {AuthUtils} from "../../utils/auth-utils";
import config from "../../config/config";

export class Login {
    constructor() {
        this.findElements();
        this.processButtonElement.addEventListener('click', this.login.bind(this));

    }

    findElements() {
        this.emailElement = document.getElementById('emailInput');
        this.passwordElement = document.getElementById('passwordInput');
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

        return isError;
    }

    async login() {
        if (!this.validate()) {
            const result = {
                error: false,
                response: null
            };

            const params = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                },
            };

            const body = {
                "email": this.emailElement.value,
                "password": this.passwordElement.value,
                "rememberMe": this.processButtonElement.value
            };

            let token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
                if (token)
                    params.headers["authorization"] = token;

            if (body) {
                params.body = JSON.stringify(body);
            }

            let response = null;

            try {
                response = await fetch(config.api + '/login', params);
                result.response = await response.json();
            } catch (e) {
                result.error = true;
                return result;
            }
            if (response.status < 200 || response.status >= 300) {
                result.error = true;
                if (response.status === 401) {
                    if (!token) {
                        //токена нет
                        result.redirect = '/login';
                    } else {
                        //токен устарел, надо обновить
                        const updateTokenResult = await AuthUtils.updateRefreshToken();

                        if (updateTokenResult) {
                            //делаем запрос повторно так как токены обновлены
                            // return this.request(url, method, useAuth, body);
                        } else {
                            result.redirect = '/login';
                        }
                    }
                }
            }
            return result;
        }
    }
}
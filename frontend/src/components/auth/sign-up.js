import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey))
            return this.openNewRoute('/');

        this.findElements();
        this.processButtonElement.addEventListener('click', this.signUp.bind(this));
    }

    findElements() {
        this.fullNameElement = document.getElementById('nameInput');
        this.emailElement = document.getElementById('emailInput');
        this.passwordElement = document.getElementById('passwordInput');
        this.passwordRepeatElement = document.getElementById('passwordRepeatInput');
        this.processButtonElement = document.getElementById('process-btn');
    }

    validate() {
        let isError = false;
        if (this.fullNameElement.value && this.fullNameElement.value.trim().match(/^[А-Я][а-я]+\s[А-Я][а-я]+\s[А-Я][а-я]/)) {
            this.fullNameElement.classList.remove('is-invalid');
        } else {
            isError = true;
            this.fullNameElement.classList.add('is-invalid');
        }
        if (this.emailElement.value && this.emailElement.value.match(/^[a-z1-9]+@[a-z1-9]+\.[a-z1-9]+$/i)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            isError = true;
            this.emailElement.classList.add('is-invalid');
        }
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            isError = true;
            this.passwordElement.classList.add('is-invalid');
        }
        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            isError = true;
            this.passwordRepeatElement.classList.add('is-invalid');
        }

        return !isError;
    }

    async signUp() {
        if (this.validate()) {
            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: this.fullNameElement.value.split(' ')[1],
                lastName: this.fullNameElement.value.split(' ')[0],
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            });

            if (result.error || !result.response || (result.response && (!result.response.user.id ||
                !result.response.user.email || !result.response.user.name || !result.response.user.lastName))) {
                console.log(result.response.message);
                return false;
            }

            const tokensResult = await HttpUtils.request('/login', 'POST', false, {
                email: result.response.user.email,
                password: this.passwordElement.value,
                rememberMe: false
            });

            if (tokensResult.error || !tokensResult.response || (tokensResult.response &&
                (!tokensResult.response.tokens.accessToken || !tokensResult.response.tokens.refreshToken))) {
                console.log(tokensResult.response.message)
                return false;
            }

            AuthUtils.setAuthInfo(tokensResult.response.tokens.accessToken, tokensResult.response.tokens.refreshToken,
                JSON.stringify({
                    id: result.response.user.id,
                    name: result.response.user.name,
                    lastName: result.response.user.lastName,
                    balance: '0'
                }));

            this.openNewRoute('/');
        }
    }
}
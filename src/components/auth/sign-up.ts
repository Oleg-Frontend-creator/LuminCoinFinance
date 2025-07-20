import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {ResultResponseType} from "../../types/result-response.type";
import {SignupResponseType} from "../../types/signup-response.type";
import {TokensResponseType} from "../../types/tokens-response.type";

export class SignUp {
    private readonly fullNameElement: HTMLInputElement = <HTMLInputElement>document.getElementById('nameInput');
    private readonly emailElement: HTMLInputElement = <HTMLInputElement>document.getElementById('emailInput');
    private readonly passwordElement: HTMLInputElement = <HTMLInputElement>document.getElementById('passwordInput');
    private readonly passwordRepeatElement: HTMLInputElement = <HTMLInputElement>document.getElementById('passwordRepeatInput');
    private readonly processButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById('process-btn');
    private readonly openNewRoute: Function;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey))
            return this.openNewRoute('/');

        this.processButtonElement.addEventListener('click', this.signUp.bind(this));
    }


    private validate(): boolean {
        let isError: boolean = false;
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

    private async signUp(): Promise<void> {
        if (this.validate()) {
            const result: ResultResponseType = await HttpUtils.request('/signup', 'POST', false, {
                name: this.fullNameElement.value.split(' ')[1],
                lastName: this.fullNameElement.value.split(' ')[0],
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            });
            const response: SignupResponseType = result.response;
            if (result.error || !response || (response && (!response.user.id ||
                !response.user.email || !response.user.name || !response.user.lastName))) {
                return console.log(result.response.message);
            }

            const tokensResult: ResultResponseType = await HttpUtils.request('/login', 'POST', false, {
                email: result.response.user.email,
                password: this.passwordElement.value,
                rememberMe: false
            });
            const tokensResponse: TokensResponseType = tokensResult.response;
            if (tokensResult.error || !tokensResponse || (tokensResponse &&
                (!tokensResponse.tokens.accessToken || !tokensResponse.tokens.refreshToken))) {
                return console.log(tokensResult.response.message);
            }

            AuthUtils.setAuthInfo({
                accessToken: tokensResult.response.tokens.accessToken,
                refreshToken: tokensResult.response.tokens.refreshToken,
                userInfo: JSON.stringify({
                    id: result.response.user.id,
                    name: result.response.user.name,
                    lastName: result.response.user.lastName,
                    balance: '0'
                })
            });

            this.openNewRoute('/');
        }
    }
}
import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {LoginResponseType} from "../../types/login-response.type";
import {ResultResponseType} from "../../types/result-response.type";

export class Login {
    private readonly emailElement: HTMLInputElement | null = <HTMLInputElement>document.getElementById('emailInput');
    private readonly passwordElement: HTMLInputElement | null = <HTMLInputElement>document.getElementById('passwordInput');
    private readonly rememberMeElement: HTMLInputElement | null = <HTMLInputElement>document.getElementById('rememberMe');
    private readonly processButtonElement: HTMLButtonElement | null = <HTMLButtonElement>document.getElementById('process-btn');
    private readonly openNewRoute: Function;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (this.processButtonElement)
            this.processButtonElement.addEventListener('click', this.login.bind(this));
    }

    private validate(): boolean {
        let isError: boolean = false;
        if (this.emailElement)
            if (this.emailElement.value && this.emailElement.value.match(/^\S+@\S+\.\S+$/)) {
                this.emailElement.classList.remove('is-invalid');
            } else {
                isError = true;
                this.emailElement.classList.add('is-invalid');
            }
        if (this.passwordElement)
            if (this.passwordElement.value) {
                this.passwordElement.classList.remove('is-invalid');
            } else {
                isError = true;
                this.passwordElement.classList.add('is-invalid');
            }

        return !isError;
    }

    private async login(): Promise<void> {
        if (this.validate() && this.emailElement && this.passwordElement && this.rememberMeElement) {

            const result: ResultResponseType = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            });

            const response: LoginResponseType = result.response;
            if (result.error || !response || (response &&
                (!response.tokens.accessToken || !response.tokens.refreshToken || !response.user.name ||
                    !response.user.lastName || !response.user.id))) {
                return console.log(result.response.message);
            }

            AuthUtils.setAuthInfo({
                accessToken: response.tokens.accessToken,
                refreshToken: response.tokens.refreshToken,
                userInfo: JSON.stringify({
                    id: response.user.id,
                    name: response.user.name,
                    lastName: response.user.lastName
                })
            });
            this.openNewRoute('/');
        }
    }
}
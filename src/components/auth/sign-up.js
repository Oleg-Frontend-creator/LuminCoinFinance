export class SignUp {
    constructor() {
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
        if (this.fullNameElement.value) {
            this.fullNameElement.classList.remove('is-invalid');
        } else {
            isError = true;
            this.fullNameElement.classList.add('is-invalid');
        }
        if (this.emailElement.value && this.emailElement.value.match(/^\S+@\S+\.\S+$/)) {
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

        return isError;
    }

    async signUp() {
        if (!this.validate()) {
            const loginResult = await AuthService.login({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            });

            const result = await HttpUtils.request('/login', 'POST', false, data);

            if (result.error || !result.response ||
                (result.response && (!result.response.accessToken || !result.response.refreshToken
                    || !result.response.id || !result.response.name))) {
                return false;
            }

            return result;


            AuthUtils.setAuthInfo(loginResult.response.accessToken, loginResult.response.refreshToken,
                JSON.stringify({id: loginResult.response.id, name: loginResult.response.name}));

            this.openNewRoute('/');
        }
    }
}
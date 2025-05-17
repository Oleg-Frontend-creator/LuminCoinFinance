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

    login() {
        if (!this.validate()) {
            console.log('VALID');
        }
    }
}
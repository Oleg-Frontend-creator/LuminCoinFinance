"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = void 0;
const http_utils_1 = require("../../utils/http-utils");
const auth_utils_1 = require("../../utils/auth-utils");
class SignUp {
    constructor(openNewRoute) {
        this.fullNameElement = document.getElementById('nameInput');
        this.emailElement = document.getElementById('emailInput');
        this.passwordElement = document.getElementById('passwordInput');
        this.passwordRepeatElement = document.getElementById('passwordRepeatInput');
        this.processButtonElement = document.getElementById('process-btn');
        this.openNewRoute = openNewRoute;
        if (auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.accessTokenKey))
            return this.openNewRoute('/');
        this.processButtonElement.addEventListener('click', this.signUp.bind(this));
    }
    validate() {
        let isError = false;
        if (this.fullNameElement.value && this.fullNameElement.value.trim().match(/^[А-Я][а-я]+\s[А-Я][а-я]+\s[А-Я][а-я]/)) {
            this.fullNameElement.classList.remove('is-invalid');
        }
        else {
            isError = true;
            this.fullNameElement.classList.add('is-invalid');
        }
        if (this.emailElement.value && this.emailElement.value.match(/^[a-z1-9]+@[a-z1-9]+\.[a-z1-9]+$/i)) {
            this.emailElement.classList.remove('is-invalid');
        }
        else {
            isError = true;
            this.emailElement.classList.add('is-invalid');
        }
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        }
        else {
            isError = true;
            this.passwordElement.classList.add('is-invalid');
        }
        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        }
        else {
            isError = true;
            this.passwordRepeatElement.classList.add('is-invalid');
        }
        return !isError;
    }
    signUp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validate()) {
                const result = yield http_utils_1.HttpUtils.request('/signup', 'POST', false, {
                    name: this.fullNameElement.value.split(' ')[1],
                    lastName: this.fullNameElement.value.split(' ')[0],
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.passwordRepeatElement.value
                });
                const response = result.response;
                if (result.error || !response || (response && (!response.user.id ||
                    !response.user.email || !response.user.name || !response.user.lastName))) {
                    return console.log(result.response.message);
                }
                const tokensResult = yield http_utils_1.HttpUtils.request('/login', 'POST', false, {
                    email: result.response.user.email,
                    password: this.passwordElement.value,
                    rememberMe: false
                });
                const tokensResponse = tokensResult.response;
                if (tokensResult.error || !tokensResponse || (tokensResponse &&
                    (!tokensResponse.tokens.accessToken || !tokensResponse.tokens.refreshToken))) {
                    return console.log(tokensResult.response.message);
                }
                auth_utils_1.AuthUtils.setAuthInfo({
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
        });
    }
}
exports.SignUp = SignUp;
//# sourceMappingURL=sign-up.js.map
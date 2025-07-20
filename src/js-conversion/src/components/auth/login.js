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
exports.Login = void 0;
const auth_utils_1 = require("../../utils/auth-utils");
const http_utils_1 = require("../../utils/http-utils");
class Login {
    constructor(openNewRoute) {
        this.emailElement = document.getElementById('emailInput');
        this.passwordElement = document.getElementById('passwordInput');
        this.rememberMeElement = document.getElementById('rememberMe');
        this.processButtonElement = document.getElementById('process-btn');
        this.openNewRoute = openNewRoute;
        if (this.processButtonElement)
            this.processButtonElement.addEventListener('click', this.login.bind(this));
    }
    validate() {
        let isError = false;
        if (this.emailElement)
            if (this.emailElement.value && this.emailElement.value.match(/^\S+@\S+\.\S+$/)) {
                this.emailElement.classList.remove('is-invalid');
            }
            else {
                isError = true;
                this.emailElement.classList.add('is-invalid');
            }
        if (this.passwordElement)
            if (this.passwordElement.value) {
                this.passwordElement.classList.remove('is-invalid');
            }
            else {
                isError = true;
                this.passwordElement.classList.add('is-invalid');
            }
        return !isError;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validate() && this.emailElement && this.passwordElement && this.rememberMeElement) {
                const result = yield http_utils_1.HttpUtils.request('/login', 'POST', false, {
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                });
                const response = result.response;
                if (result.error || !response || (response &&
                    (!response.tokens.accessToken || !response.tokens.refreshToken || !response.user.name ||
                        !response.user.lastName || !response.user.id))) {
                    return console.log(result.response.message);
                }
                auth_utils_1.AuthUtils.setAuthInfo({
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
        });
    }
}
exports.Login = Login;
//# sourceMappingURL=login.js.map
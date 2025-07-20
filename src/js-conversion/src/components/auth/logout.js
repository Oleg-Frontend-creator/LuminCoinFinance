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
exports.Logout = void 0;
const auth_utils_1 = require("../../utils/auth-utils");
const http_utils_1 = require("../../utils/http-utils");
class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.accessTokenKey) || !auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }
        this.logout().then();
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request('/logout', 'POST', false, {
                refreshToken: auth_utils_1.AuthUtils.refreshTokenKey
            });
            if (result.error || !result.response) {
                return console.log(result.response.message);
            }
            auth_utils_1.AuthUtils.removeAuthInfo();
            this.openNewRoute('/login');
        });
    }
}
exports.Logout = Logout;
//# sourceMappingURL=logout.js.map
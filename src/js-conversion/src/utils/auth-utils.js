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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtils = void 0;
const config_1 = __importDefault(require("../config/config"));
class AuthUtils {
    static setAuthInfo(authInfo) {
        if (authInfo.accessToken && authInfo.refreshToken) {
            localStorage.setItem(this.accessTokenKey, authInfo.accessToken);
            localStorage.setItem(this.refreshTokenKey, authInfo.refreshToken);
        }
        if (authInfo.userInfo) {
            localStorage.setItem(this.userInfoTokenKey, authInfo.userInfo);
        }
    }
    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }
    static getAuthInfo(key) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);
        }
        else if (!key || ![this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return {
                [this.accessTokenKey]: localStorage.getItem((this.accessTokenKey)),
                [this.refreshTokenKey]: localStorage.getItem((this.refreshTokenKey)),
                [this.userInfoTokenKey]: localStorage.getItem((this.userInfoTokenKey)),
            };
        }
        else {
            return null;
        }
    }
    static updateRefreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = false;
            const refreshToken = this.getAuthInfo(this.refreshTokenKey);
            if (refreshToken) {
                const response = yield fetch(config_1.default.api + '/refresh', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({ refreshToken: refreshToken })
                });
                if (response && response.status === 200) {
                    const tokens = yield response.json();
                    if (tokens) {
                        this.setAuthInfo({
                            accessToken: tokens.tokens.accessToken,
                            refreshToken: tokens.tokens.refreshToken
                        });
                        result = true;
                    }
                }
            }
            if (!result) {
                this.removeAuthInfo();
            }
            return result;
        });
    }
}
exports.AuthUtils = AuthUtils;
AuthUtils.accessTokenKey = 'accessToken';
AuthUtils.refreshTokenKey = 'refreshToken';
AuthUtils.userInfoTokenKey = 'userInfo';
//# sourceMappingURL=auth-utils.js.map
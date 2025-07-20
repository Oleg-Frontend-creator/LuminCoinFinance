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
exports.HttpUtils = void 0;
const auth_utils_1 = require("./auth-utils");
const config_1 = __importDefault(require("../config/config"));
class HttpUtils {
    static request(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, method = 'GET', useAuth = true, body = null) {
            const result = {
                response: null,
                error: false
            };
            const params = {
                method: method,
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                }
            };
            let token = auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.accessTokenKey);
            if (useAuth && token) {
                params.headers["x-auth-token"] = token;
            }
            if (body) {
                params.body = JSON.stringify(body);
            }
            let response;
            try {
                response = yield fetch(config_1.default.api + url, params);
                result.response = yield response.json();
            }
            catch (e) {
                result.error = true;
                return result;
            }
            if (response.status < 200 || response.status >= 300) {
                result.error = true;
                if (useAuth && response.status === 401) {
                    if (!token) {
                        //токена нет
                        result.redirect = '/login';
                    }
                    else {
                        //токен устарел, надо обновить
                        const updateTokenResult = yield auth_utils_1.AuthUtils.updateRefreshToken();
                        if (updateTokenResult) {
                            //делаем запрос повторно так как токены обновлены
                            return this.request(url, method, useAuth, body);
                        }
                        else {
                            result.redirect = '/login';
                        }
                    }
                }
            }
            return result;
        });
    }
}
exports.HttpUtils = HttpUtils;
//# sourceMappingURL=http-utils.js.map
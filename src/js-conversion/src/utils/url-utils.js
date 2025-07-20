"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlUtils = void 0;
class UrlUtils {
    static getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
}
exports.UrlUtils = UrlUtils;
//# sourceMappingURL=url-utils.js.map
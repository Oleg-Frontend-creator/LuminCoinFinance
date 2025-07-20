"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = void 0;
class FileUtils {
    static loadPageScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);
            script.onerror = () => reject(new Error('Script load error for: ' + src));
            document.body.appendChild(script);
        });
    }
}
exports.FileUtils = FileUtils;
//# sourceMappingURL=file-utils.js.map
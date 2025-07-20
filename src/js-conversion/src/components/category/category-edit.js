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
exports.CategoryEdit = void 0;
const click_utils_1 = require("../../utils/click-utils");
const url_utils_1 = require("../../utils/url-utils");
const http_utils_1 = require("../../utils/http-utils");
class CategoryEdit {
    constructor(openNewRoute, categoryType) {
        this.originalCategoryName = null;
        this.categoryNameInputElement = document.getElementById('categoryNameInput');
        this.saveButtonElement = document.getElementById('save-button');
        click_utils_1.ClickUtils.addEvents(window.location.pathname);
        this.openNewRoute = openNewRoute;
        this.categoryType = categoryType;
        this.categoryId = url_utils_1.UrlUtils.getUrlParam('id');
        if (!this.categoryId) {
            return this.openNewRoute('/');
        }
        this.saveButtonElement.addEventListener('click', this.saveButtonClick.bind(this));
        this.getCategoryName().then();
    }
    saveButtonClick() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.categoryNameInputElement.value !== '' && this.categoryNameInputElement.value.match(/[a-zа-я]/i)) {
                this.categoryNameInputElement.classList.remove('is-invalid');
                if (this.originalCategoryName !== this.categoryNameInputElement.value) {
                    yield this.updateCategoryName();
                    this.openNewRoute('/categories/' + this.categoryType);
                }
            }
            else {
                this.categoryNameInputElement.classList.add('is-invalid');
            }
        });
    }
    getCategoryName() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request(`/categories/${this.categoryType}/` + this.categoryId);
            if (result.error) {
                return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
            }
            const category = result.response;
            this.categoryNameInputElement.value = category.title;
            this.originalCategoryName = category.title;
        });
    }
    updateCategoryName() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request(`/categories/${this.categoryType}/` + this.categoryId, 'PUT', true, { title: this.categoryNameInputElement.value });
            if (result.error) {
                return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
            }
        });
    }
}
exports.CategoryEdit = CategoryEdit;
//# sourceMappingURL=category-edit.js.map
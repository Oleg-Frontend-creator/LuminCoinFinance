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
exports.CategoryCreate = void 0;
const click_utils_1 = require("../../utils/click-utils");
const http_utils_1 = require("../../utils/http-utils");
class CategoryCreate {
    constructor(openNewRoute, categoryType) {
        this.categoryNameInputElement = document.getElementById('categoryNameInput');
        this.createButtonElement = document.getElementById('create-button');
        click_utils_1.ClickUtils.addEvents(window.location.pathname);
        this.createButtonElement.addEventListener('click', this.createButtonClick.bind(this));
        this.categoryType = categoryType;
        this.openNewRoute = openNewRoute;
        this.createNewCategory().then();
    }
    createButtonClick() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.categoryNameInputElement.value !== '' && this.categoryNameInputElement.value.match(/[a-zа-я]/i)) {
                this.categoryNameInputElement.classList.remove('is-invalid');
                yield this.createNewCategory();
                this.openNewRoute('/categories/' + this.categoryType);
            }
            else {
                this.categoryNameInputElement.classList.add('is-invalid');
            }
        });
    }
    createNewCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request(`/categories/${this.categoryType}/`, 'POST', true, { title: this.categoryNameInputElement.value });
            if (result.error) {
                return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
            }
        });
    }
}
exports.CategoryCreate = CategoryCreate;
//# sourceMappingURL=category-create.js.map
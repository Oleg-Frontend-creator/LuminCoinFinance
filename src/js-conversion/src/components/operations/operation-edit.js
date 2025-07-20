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
exports.OperationEdit = void 0;
const click_utils_1 = require("../../utils/click-utils");
const url_utils_1 = require("../../utils/url-utils");
const http_utils_1 = require("../../utils/http-utils");
class OperationEdit {
    constructor(openNewRoute) {
        this.typeInputElement = document.getElementById('typeInput');
        this.categorySelectElement = document.getElementById('categorySelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');
        this.saveButtonElement = document.getElementById('save-button');
        click_utils_1.ClickUtils.addEvents(window.location.pathname);
        this.openNewRoute = openNewRoute;
        this.operationId = url_utils_1.UrlUtils.getUrlParam('id');
        if (!this.operationId) {
            return this.openNewRoute('/');
        }
        this.saveButtonElement.addEventListener('click', this.saveButtonClick.bind(this));
        this.getOperation().then();
    }
    getOperation() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request('/operations/' + this.operationId);
            if (result.error) {
                return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
            }
            const operation = result.response;
            this.operationType = operation.type;
            if (operation.type === 'expense') {
                this.typeInputElement.value = "Расход";
            }
            else if (operation.type === 'income') {
                this.typeInputElement.value = "Доход";
            }
            else {
                this.typeInputElement.value = "Неизвестно";
            }
            if (operation.category)
                yield this.setCategoriesInSelect(operation.category);
            this.amountInputElement.value = operation.amount.toString();
            this.dateInputElement.value = operation.date;
            this.commentInputElement.value = operation.comment;
        });
    }
    saveButtonClick(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            if (this.validation()) {
                const data = {
                    type: (this.typeInputElement.value.toLowerCase().trim() === 'расход') ? "expense" : "income",
                    amount: parseInt(this.amountInputElement.value),
                    comment: this.commentInputElement.value,
                    date: this.dateInputElement.value
                };
                if (this.categorySelectElement.value) {
                    const categoryId = yield this.getCategoryId(this.categorySelectElement.value, (this.typeInputElement.value.toLowerCase().trim() === 'расход') ? "expense" : "income");
                    if (categoryId)
                        data.category_id = categoryId.toString();
                }
                const result = yield http_utils_1.HttpUtils.request('/operations/' + this.operationId, 'PUT', true, data);
                if (result.error) {
                    return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
                }
                return this.openNewRoute('/operations');
            }
        });
    }
    validation() {
        let isError = false;
        if (!['расход', 'доход'].includes(this.typeInputElement.value)) {
            this.typeInputElement.classList.add('is-invalid');
            isError = true;
        }
        else {
            this.typeInputElement.classList.remove('is-invalid');
        }
        if (parseInt(this.categorySelectElement.value) === -1) {
            this.categorySelectElement.classList.add('is-invalid');
            isError = true;
        }
        else {
            this.categorySelectElement.classList.remove('is-invalid');
        }
        if (!this.amountInputElement.value || !this.amountInputElement.value.match(/^\d+\$?$/)) {
            this.amountInputElement.classList.add('is-invalid');
            isError = true;
        }
        else {
            this.amountInputElement.classList.remove('is-invalid');
        }
        if (!this.dateInputElement.value) {
            this.dateInputElement.classList.add('is-invalid');
            isError = true;
        }
        else {
            this.dateInputElement.classList.remove('is-invalid');
        }
        if (!this.commentInputElement.value) {
            this.commentInputElement.classList.add('is-invalid');
            isError = true;
        }
        else {
            this.commentInputElement.classList.remove('is-invalid');
        }
        return !isError;
    }
    getCategoryId(categoryName, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request('/categories/' + type);
            if (result.error) {
                console.log(result.response.message);
                this.openNewRoute(result.redirect);
                return null;
            }
            const categories = result.response;
            const resultCategory = categories.find(category => category.title === categoryName);
            return resultCategory ? resultCategory.id : null;
        });
    }
    setCategoriesInSelect(currentCategoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request('/categories/' + this.operationType);
            if (result.error) {
                return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
            }
            if (result.response) {
                const categories = result.response;
                for (let i = 0; i < categories.length; i++) {
                    const optionElement = document.createElement('option');
                    optionElement.value = categories[i].id.toString();
                    optionElement.innerText = categories[i].title;
                    if (optionElement.innerText === currentCategoryName) {
                        optionElement.selected = true;
                    }
                    this.categorySelectElement.appendChild(optionElement);
                }
            }
        });
    }
}
exports.OperationEdit = OperationEdit;
//# sourceMappingURL=operation-edit.js.map
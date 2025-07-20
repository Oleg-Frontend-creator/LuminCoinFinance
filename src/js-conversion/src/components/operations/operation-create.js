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
exports.OperationCreate = void 0;
const click_utils_1 = require("../../utils/click-utils");
const http_utils_1 = require("../../utils/http-utils");
const url_utils_1 = require("../../utils/url-utils");
class OperationCreate {
    constructor(openNewRoute) {
        this.operationType = null;
        this.typeInputElement = document.getElementById('typeInput');
        this.categorySelectElement = document.getElementById('categorySelect');
        this.createButtonElement = document.getElementById('create-button');
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');
        this.openNewRoute = openNewRoute;
        this.operationType = url_utils_1.UrlUtils.getUrlParam('type');
        if (!this.operationType) {
            return this.openNewRoute('/');
        }
        this.init().then();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setCategoriesInSelect();
            click_utils_1.ClickUtils.addEvents(window.location.pathname);
            if (this.operationType === 'expense') {
                this.typeInputElement.value = "Расход";
            }
            else if (this.operationType === 'income') {
                this.typeInputElement.value = "Доход";
            }
        });
    }
    createNewOperation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request('/operations', 'POST', true, data);
            if (result.error) {
                return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
            }
            return this.openNewRoute('/operations');
        });
    }
    createButtonClick(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validation()) {
                e.preventDefault();
                const data = {
                    type: this.operationType,
                    amount: parseInt(this.amountInputElement.value),
                    comment: this.commentInputElement.value,
                    date: this.dateInputElement.value,
                    category_id: this.categorySelectElement.value
                };
                return this.createNewOperation(data);
            }
        });
    }
    validation() {
        let isError = false;
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
    setCategoriesInSelect() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request('/categories/' + this.operationType);
            if (result.error) {
                return result.redirect ? this.openNewRoute(result.redirect) :
                    console.log(result.response ? result.response.message : 'неизвестная ошибка');
            }
            const categories = result.response;
            if (categories.length) {
                for (let i = 0; i < categories.length; i++) {
                    const optionElement = document.createElement('option');
                    optionElement.value = categories[i].id.toString();
                    optionElement.innerText = categories[i].title;
                    this.categorySelectElement.appendChild(optionElement);
                }
            }
            else {
                alert('Категории отсутствуют. Пожалуйста, вернитесь на страницы создания категорий и создайте их.');
                return this.openNewRoute('/');
            }
            this.createButtonElement.addEventListener('click', this.createButtonClick.bind(this));
        });
    }
}
exports.OperationCreate = OperationCreate;
//# sourceMappingURL=operation-create.js.map
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
exports.CategoryList = void 0;
const click_utils_1 = require("../../utils/click-utils");
const http_utils_1 = require("../../utils/http-utils");
class CategoryList {
    constructor(openNewRoute, categoryType) {
        this.deleteCategoryButton = document.getElementById('delete-category-btn');
        this.modalElement = document.getElementById('modal-category');
        click_utils_1.ClickUtils.addEvents(window.location.pathname);
        this.openNewRoute = openNewRoute;
        this.categoryType = categoryType;
        this.deleteCategoryButton.addEventListener('click', this.deleteCategory.bind(this));
        this.getExpenses.call(this).then();
    }
    getExpenses() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request('/categories/' + this.categoryType);
            if (result.error && result.redirect) {
                return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
            }
            const categoriesListElement = document.getElementById('category-list');
            const categoriesExpense = result.response;
            if (categoriesExpense.length > 0) {
                for (let i = 0; i < categoriesExpense.length; i++) {
                    const categoryElement = document.createElement('div');
                    categoryElement.className = 'col mb-1 d-md-block d-flex justify-content-center';
                    categoryElement.setAttribute('id', 'category-card-' + categoriesExpense[i].id);
                    const cardElement = document.createElement('div');
                    cardElement.className = 'card p-1 mb-3 rounded-4';
                    const cardBodyElement = document.createElement('div');
                    cardBodyElement.className = 'card-body';
                    const cardTitleElement = document.createElement('h5');
                    cardTitleElement.className = 'card-title fs-3 fw-bold text-primary-emphasis';
                    cardTitleElement.innerText = result.response[i].title;
                    const editLinkElement = document.createElement('a');
                    editLinkElement.className = 'custom-page-link btn btn-primary me-2';
                    editLinkElement.setAttribute('href', `/categories/${this.categoryType}/edit?id=${result.response[i].id}`);
                    editLinkElement.innerText = 'Редактировать';
                    const deleteButtonElement = document.createElement('button');
                    deleteButtonElement.className = 'btn btn-danger delete-button';
                    deleteButtonElement.setAttribute('type', 'button');
                    deleteButtonElement.setAttribute('id', result.response[i].id.toString());
                    deleteButtonElement.innerText = 'Удалить';
                    cardBodyElement.appendChild(cardTitleElement);
                    cardBodyElement.appendChild(editLinkElement);
                    cardBodyElement.appendChild(deleteButtonElement);
                    cardElement.appendChild(cardBodyElement);
                    categoryElement.appendChild(cardElement);
                    categoriesListElement.appendChild(categoryElement);
                }
            }
            categoriesListElement.innerHTML += '<div class="col mb-1 d-md-block d-flex justify-content-center" id="add-card">\n' +
                '        <a href="/categories/' + this.categoryType + '/create" class="custom-page-link card add-category-card p-1 mb-3 rounded-4 text-decoration-none">\n' +
                '            <div class="card-body d-flex justify-content-center align-items-center fs-2 text-opacity-50">\n' +
                '                +\n' +
                '            </div>\n' +
                '        </a>\n' +
                '    </div>';
            const deleteButtons = document.getElementsByClassName('delete-button');
            for (let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].addEventListener('click', this.setIdCategory.bind(this));
            }
        });
    }
    setIdCategory(e) {
        if (e && e.target) {
            this.modalElement.style.display = 'block';
            const targetElement = e.target;
            const targetParentElement = targetElement === null || targetElement === void 0 ? void 0 : targetElement.parentElement;
            if (targetParentElement && targetParentElement.tagName === 'svg' && targetParentElement.getAttribute('id')) {
                this.modalElement.setAttribute('data-operation-id', targetParentElement.getAttribute('id'));
            }
            else if (targetParentElement && targetParentElement.tagName !== 'svg' && (targetElement === null || targetElement === void 0 ? void 0 : targetElement.getAttribute('id'))) {
                this.modalElement.setAttribute('data-operation-id', targetElement.getAttribute('id'));
            }
        }
    }
    deleteCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = this.modalElement.getAttribute('data-category-id');
            const result = yield http_utils_1.HttpUtils.request(`/categories/${this.categoryType}/${id}`, 'DELETE', true);
            if (result.error) {
                return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
            }
            if (id) {
                yield this.deleteOperations(id);
                (_a = document.getElementById('category-card-' + id)) === null || _a === void 0 ? void 0 : _a.remove();
            }
            this.modalElement.style.display = 'none';
        });
    }
    deleteOperations(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield http_utils_1.HttpUtils.request(`/categories/${this.categoryType}/${categoryId}`);
            const categoryName = category.response.title;
            const response = yield http_utils_1.HttpUtils.request('/operations?period=interval&dateFrom=1000-01-01&dateTo=3000-01-01');
            const operations = response.response;
            if (operations)
                operations.forEach(operation => {
                    operation.category === categoryName ? http_utils_1.HttpUtils.request('/operations/' + operation.id, 'DELETE', true) : '';
                });
        });
    }
}
exports.CategoryList = CategoryList;
//# sourceMappingURL=category-list.js.map
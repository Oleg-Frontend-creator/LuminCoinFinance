import {ClickUtils} from "../../utils/click-utils";
import {UrlUtils} from "../../utils/url-utils";
import {HttpUtils} from "../../utils/http-utils";

export class OperationEdit {
    constructor(openNewRoute) {
        ClickUtils.addEvents(window.location.pathname);
        this.openNewRoute = openNewRoute;
        this.operationId = UrlUtils.getUrlParam('id');
        if (!this.operationId) {
            return this.openNewRoute('/');
        }

        this.findElements().then();
        this.getOperation().then();
    }

    async findElements() {
        this.typeInputElement = document.getElementById('typeInput');
        this.categorySelectElement = document.getElementById('categorySelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');
        this.saveButtonElement = document.getElementById('save-button');
        this.saveButtonElement.addEventListener('click', this.saveButtonClick.bind(this));
    }

    async getOperation() {
        const result = await HttpUtils.request('/operations/' + this.operationId);

        if (result.error) {
            console.log(result.response.message);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        this.operationType = result.response.type;
        if (result.response.type === 'expense') {
            this.typeInputElement.value = "Расход";
        } else if (result.response.type === 'income') {
            this.typeInputElement.value = "Доход";
        } else {
            this.typeInputElement.value = "Неизвестно";
        }
        await this.setCategoriesInSelect(result.response.category);
        this.amountInputElement.value = result.response.amount;
        this.dateInputElement.value = result.response.date;
        this.commentInputElement.value = result.response.comment;
    }

    async saveButtonClick(e) {
        e.preventDefault();

        if (this.validation()) {
            const data = {
                type: (this.typeInputElement.value.toLowerCase().trim() === 'расход') ? "expense" : "income",
                amount: this.amountInputElement.value,
                comment: this.commentInputElement.value,
                date: this.dateInputElement.value
            };
            if (this.categorySelectElement.value)
                data.category_id = await this.getCategoryId(this.categorySelectElement.value,
                    (this.typeInputElement.value.toLowerCase().trim() === 'расход') ? "expense" : "income");

            const result = await HttpUtils.request('/operations/' + this.operationId, 'PUT', true, data);

            if (result.error) {
                console.log(result.response.message);
                return result.redirect ? this.openNewRoute(result.redirect) : null;
            }

            return this.openNewRoute('/operations');
        }
    }

    validation() {
        let isError = false;

        if (!['расход', 'доход'].includes(this.typeInputElement.value)) {
            this.typeInputElement.classList.add('is-invalid');
            isError = true;
        } else {
            this.typeInputElement.classList.remove('is-invalid');
        }

        if (parseInt(this.categorySelectElement.value) === -1) {
            this.categorySelectElement.classList.add('is-invalid');
            isError = true;
        } else {
            this.categorySelectElement.classList.remove('is-invalid');
        }

        if (!this.amountInputElement.value || !this.amountInputElement.value.match(/^\d+\$?$/)) {
            this.amountInputElement.classList.add('is-invalid');
            isError = true;
        } else {
            this.amountInputElement.classList.remove('is-invalid');
        }

        if (!this.dateInputElement.value) {
            this.dateInputElement.classList.add('is-invalid');
            isError = true;
        } else {
            this.dateInputElement.classList.remove('is-invalid');
        }

        if (!this.commentInputElement.value) {
            this.commentInputElement.classList.add('is-invalid');
            isError = true;
        } else {
            this.commentInputElement.classList.remove('is-invalid');
        }

        return !isError;
    }

    async getCategoryId(categoryName, type) {
        const categories = await HttpUtils.request('/categories/' + type);

        if (categories.error) {
            console.log(categories.response.message);
            return categories.redirect ? this.openNewRoute(categories.redirect) : null;
        }

        return categories.response.find(category => category.title === categoryName).id;
    }

    async setCategoriesInSelect(currentCategoryName) {
        this.categories = await HttpUtils.request('/categories/' + this.operationType);
        if (this.categories.error) {
            console.log(this.categories.response ? this.categories.response.message : 'неизвестная ошибка');
            return this.categories.redirect ? this.openNewRoute(this.categories.redirect) : null;
        }

        if (this.categories.response)
            for (let i = 0; i < this.categories.response.length; i++) {
                const optionElement = document.createElement('option');
                optionElement.value = this.categories.response[i].id;
                optionElement.innerText = this.categories.response[i].title;
                if (optionElement.innerText === currentCategoryName) {
                    optionElement.selected = true;
                }
                this.categorySelectElement.appendChild(optionElement);
            }
    }
}
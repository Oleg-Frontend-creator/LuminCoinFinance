import {ClickUtils} from "../../utils/click-utils";
import {HttpUtils} from "../../utils/http-utils";
import {UrlUtils} from "../../utils/url-utils";

export class OperationCreate {
    constructor(openNewRoute) {
        this.operationType = UrlUtils.getUrlParam('type');
        this.openNewRoute = openNewRoute;
        if (!this.operationType) {
            return this.openNewRoute('/');
        }
        ClickUtils.addEvents(window.location.pathname);
        this.findElements().then();

        if (this.operationType === 'expense') {
            this.typeInputElement.value = "Расход";
        } else if (this.operationType === 'income') {
            this.typeInputElement.value = "Доход";
        }
    }

    async findElements() {
        this.typeInputElement = document.getElementById('typeInput');
        this.categoryInputElement = document.getElementById('categoryInput');
        this.createButtonElement = document.getElementById('create-button');
        await this.setCategoriesInSelect();
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');
    }

    async createNewOperation(data) {
        const result = await HttpUtils.request('/operations', 'POST', true, data);

        if (result.error) {
            console.log(result.response.message);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        return this.openNewRoute('/operations');
    }

    async createButtonClick(e) {
        if (this.validation()) {
            e.preventDefault();

            const data = {
                type: this.operationType,
                amount: this.amountInputElement.value,
                comment: this.commentInputElement.value,
                date: this.dateInputElement.value,
                category_id: parseInt(this.categoryInputElement.value)
            };

            return this.createNewOperation(data);
        }
    }

    validation() {
        let isError = false;

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

    async setCategoriesInSelect() {
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
                this.categoryInputElement.appendChild(optionElement);
            }

        this.createButtonElement.addEventListener('click', this.createButtonClick.bind(this));
    }
}
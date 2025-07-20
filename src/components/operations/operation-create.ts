import {ClickUtils} from "../../utils/click-utils";
import {HttpUtils} from "../../utils/http-utils";
import {UrlUtils} from "../../utils/url-utils";
import {OperationResponseType} from "../../types/operation-response.type";
import {ResultResponseType} from "../../types/result-response.type";
import {CategoryResponseType} from "../../types/category-response.type";

export class OperationCreate {
    private readonly openNewRoute: Function;
    private readonly operationType: string | null = null;

    private readonly typeInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('typeInput');
    private readonly categorySelectElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('categorySelect');
    private readonly createButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById('create-button');
    private readonly amountInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('amountInput');
    private readonly dateInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('dateInput');
    private readonly commentInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('commentInput');

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        this.operationType = UrlUtils.getUrlParam('type');
        if (!this.operationType) {
            return this.openNewRoute('/');
        }

        this.init().then();
    }

    private async init(): Promise<void> {
        await this.setCategoriesInSelect();
        ClickUtils.addEvents(window.location.pathname);

        if (this.operationType === 'expense') {
            this.typeInputElement.value = "Расход";
        } else if (this.operationType === 'income') {
            this.typeInputElement.value = "Доход";
        }
    }

    private async createNewOperation(data: OperationResponseType): Promise<void> {
        const result: ResultResponseType = await HttpUtils.request('/operations', 'POST', true, data);

        if (result.error) {
            return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
        }

        return this.openNewRoute('/operations');
    }

    private async createButtonClick(e: Event): Promise<void> {
        if (this.validation()) {
            e.preventDefault();

            const data: OperationResponseType = {
                type: <string>this.operationType,
                amount: parseInt(this.amountInputElement.value),
                comment: this.commentInputElement.value,
                date: this.dateInputElement.value,
                category_id: parseInt(this.categorySelectElement.value)
            };

            return this.createNewOperation(data);
        }
    }

    private validation(): boolean {
        let isError: boolean = false;

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

    private async setCategoriesInSelect(): Promise<void> {
        const result: ResultResponseType = await HttpUtils.request('/categories/' + this.operationType);

        if (result.error) {
            return result.redirect ? this.openNewRoute(result.redirect) :
                console.log(result.response ? result.response.message : 'неизвестная ошибка');
        }

        const categories: CategoryResponseType[] = result.response;
        if (categories.length) {
            for (let i = 0; i < categories.length; i++) {
                const optionElement: HTMLOptionElement = document.createElement('option');
                optionElement.value = categories[i].id.toString();
                optionElement.innerText = categories[i].title;
                this.categorySelectElement.appendChild(optionElement);
            }
        } else {
            alert('Категории отсутствуют. Пожалуйста, вернитесь на страницы создания категорий и создайте их.');
            return this.openNewRoute('/');
        }

        this.createButtonElement.addEventListener('click', this.createButtonClick.bind(this));
    }
}
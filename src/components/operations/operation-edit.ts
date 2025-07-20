import {ClickUtils} from "../../utils/click-utils";
import {UrlUtils} from "../../utils/url-utils";
import {HttpUtils} from "../../utils/http-utils";
import {ResultResponseType} from "../../types/result-response.type";
import {CategoryResponseType} from "../../types/category-response.type";
import {OperationResponseType} from "../../types/operation-response.type";

export class OperationEdit {
    private readonly openNewRoute: Function;
    private readonly operationId: string | null;
    private operationType: string | undefined;
    private readonly typeInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('typeInput');
    private readonly categorySelectElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('categorySelect');
    private readonly amountInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('amountInput');
    private readonly dateInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('dateInput');
    private readonly commentInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('commentInput');
    private readonly saveButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById('save-button');

    constructor(openNewRoute: Function) {
        ClickUtils.addEvents(window.location.pathname);
        this.openNewRoute = openNewRoute;
        this.operationId = UrlUtils.getUrlParam('id');
        if (!this.operationId) {
            return this.openNewRoute('/');
        }
        this.saveButtonElement.addEventListener('click', this.saveButtonClick.bind(this));

        this.getOperation().then();
    }

    private async getOperation(): Promise<void> {
        const result: ResultResponseType = await HttpUtils.request('/operations/' + this.operationId);

        if (result.error) {
            return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
        }

        const operation: OperationResponseType = result.response;
        this.operationType = operation.type;
        if (operation.type === 'expense') {
            this.typeInputElement.value = "Расход";
        } else if (operation.type === 'income') {
            this.typeInputElement.value = "Доход";
        } else {
            this.typeInputElement.value = "Неизвестно";
        }
        if (operation.category)
            await this.setCategoriesInSelect(operation.category);
        this.amountInputElement.value = operation.amount.toString();
        this.dateInputElement.value = operation.date;
        this.commentInputElement.value = operation.comment;
    }

    async saveButtonClick(e: Event): Promise<void> {
        e.preventDefault();

        if (this.validation()) {
            const data: OperationResponseType = {
                type: (this.typeInputElement.value.toLowerCase().trim() === 'расход') ? "expense" : "income",
                amount: parseInt(this.amountInputElement.value),
                comment: this.commentInputElement.value,
                date: this.dateInputElement.value
            };
            if (this.categorySelectElement.value) {
                const categoryId: number | null = await this.getCategoryId(this.categorySelectElement.value,
                    (this.typeInputElement.value.toLowerCase().trim() === 'расход') ? "expense" : "income");
                if (categoryId)
                    data.category_id = categoryId;
            }


            const result: ResultResponseType =
                await HttpUtils.request('/operations/' + this.operationId, 'PUT', true, data);

            if (result.error) {
                return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
            }

            return this.openNewRoute('/operations');
        }
    }

    private validation(): boolean {
        let isError: boolean = false;

        if (!['расход', 'доход'].includes(this.typeInputElement.value.toLowerCase().trim())) {
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

    async getCategoryId(categoryName: string, type: string): Promise<number | null> {
        const result: ResultResponseType = await HttpUtils.request('/categories/' + type);
        if (result.error) {
            console.log(result.response.message);
            this.openNewRoute(result.redirect);
            return null;
        }

        const categories: CategoryResponseType[] = result.response;
        const resultCategory: CategoryResponseType | undefined = categories.find(category => category.id === parseInt(categoryName));
        return resultCategory ? resultCategory.id : null;
    }

    private async setCategoriesInSelect(currentCategoryName: string): Promise<void> {
        const result: ResultResponseType = await HttpUtils.request('/categories/' + this.operationType);
        if (result.error) {
            return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
        }

        if (result.response) {
            const categories: CategoryResponseType[] = result.response;
            for (let i = 0; i < categories.length; i++) {
                const optionElement: HTMLOptionElement = document.createElement('option');
                optionElement.value = categories[i].id.toString();
                optionElement.innerText = categories[i].title;
                if (optionElement.innerText === currentCategoryName) {
                    optionElement.selected = true;
                }
                this.categorySelectElement.appendChild(optionElement);
            }
        }
    }
}
import {ClickUtils} from "../../utils/click-utils";
import {HttpUtils} from "../../utils/http-utils";
import {ResultResponseType} from "../../types/result-response.type";

export class CategoryCreate {
    private readonly categoryNameInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('categoryNameInput');
    private readonly createButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById('create-button');
    private readonly categoryType: string;
    private readonly openNewRoute: Function;

    constructor(openNewRoute: Function, categoryType: string) {
        ClickUtils.addEvents(window.location.pathname);
        this.createButtonElement.addEventListener('click', this.createButtonClick.bind(this));
        this.categoryType = categoryType;
        this.openNewRoute = openNewRoute;
        this.createNewCategory().then();
    }

    private async createButtonClick(): Promise<void> {
        if (this.categoryNameInputElement.value !== '' && this.categoryNameInputElement.value.match(/[a-zа-я]/i)) {
            this.categoryNameInputElement.classList.remove('is-invalid');
            await this.createNewCategory();
            this.openNewRoute('/categories/' + this.categoryType);
        } else {
            this.categoryNameInputElement.classList.add('is-invalid');
        }
    }

    private async createNewCategory(): Promise<void> {
        const result: ResultResponseType = await HttpUtils.request(`/categories/${this.categoryType}/`, 'POST', true,
            {title: this.categoryNameInputElement.value});
        if (result.error) {
            return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
        }
    }
}
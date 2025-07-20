import {ClickUtils} from "../../utils/click-utils";
import {UrlUtils} from "../../utils/url-utils";
import {HttpUtils} from "../../utils/http-utils";
import {ResultResponseType} from "../../types/result-response.type";
import {CategoryResponseType} from "../../types/category-response.type";

export class CategoryEdit {
    private readonly openNewRoute: Function;
    private readonly categoryType: string;
    private readonly categoryId: string | null;
    private originalCategoryName: string | null = null;

    private readonly categoryNameInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('categoryNameInput');
    private readonly saveButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById('save-button');

    constructor(openNewRoute: Function, categoryType: string) {
        ClickUtils.addEvents(window.location.pathname);
        this.openNewRoute = openNewRoute;
        this.categoryType = categoryType;
        this.categoryId = UrlUtils.getUrlParam('id');
        if (!this.categoryId) {
            return this.openNewRoute('/');
        }
        this.saveButtonElement.addEventListener('click', this.saveButtonClick.bind(this));

        this.getCategoryName().then();
    }

    private async saveButtonClick(): Promise<void> {
        if (this.categoryNameInputElement.value !== '' && this.categoryNameInputElement.value.match(/[a-zа-я]/i)) {
            this.categoryNameInputElement.classList.remove('is-invalid');
            if (this.originalCategoryName !== this.categoryNameInputElement.value) {
                await this.updateCategoryName();
                this.openNewRoute('/categories/' + this.categoryType);
            }
        } else {
            this.categoryNameInputElement.classList.add('is-invalid');
        }
    }

    private async getCategoryName(): Promise<void> {
        const result: ResultResponseType = await HttpUtils.request(`/categories/${this.categoryType}/` + this.categoryId);

        if (result.error) {
            return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
        }
        const category: CategoryResponseType = result.response;

        this.categoryNameInputElement.value = category.title;
        this.originalCategoryName = category.title;
    }

    private async updateCategoryName(): Promise<void> {
        const result: ResultResponseType = await HttpUtils.request(`/categories/${this.categoryType}/` + this.categoryId,
            'PUT', true, {title: this.categoryNameInputElement.value});

        if (result.error) {
            return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
        }
    }
}
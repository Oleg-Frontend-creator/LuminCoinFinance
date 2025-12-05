import {ClickUtils} from "../../utils/click-utils";
import {UrlUtils} from "../../utils/url-utils";
import {HttpUtils} from "../../utils/http-utils";

export class CategoryEdit {
    constructor(openNewRoute, categoryType) {
        ClickUtils.addEvents(window.location.pathname);
        this.categoryType = categoryType;
        this.findElements();

        this.openNewRoute = openNewRoute;
        this.categoryId = UrlUtils.getUrlParam('id');
        if (!this.categoryId) {
            return this.openNewRoute('/');
        }
        this.getCategoryName().then();
    }

    findElements() {
        this.categoryNameInputElement = document.getElementById('categoryNameInput');
        this.saveButtonElement = document.getElementById('save-button');
        this.saveButtonElement.addEventListener('click', this.saveButtonClick.bind(this));
    }

    async saveButtonClick() {
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

    async getCategoryName() {
        const result = await HttpUtils.request(`/categories/${this.categoryType}/` + this.categoryId);

        if (result.error) {
            console.log(result.response.message);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        this.categoryNameInputElement.value = result.response.title;
        this.originalCategoryName = result.response.title;
    }

    async updateCategoryName() {
        const result = await HttpUtils.request(`/categories/${this.categoryType}/` + this.categoryId, 'PUT', true,
            {title: this.categoryNameInputElement.value});

        if (result.error) {
            console.log(result.response.message);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }
    }
}
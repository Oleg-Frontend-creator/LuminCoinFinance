import {ClickUtils} from "../../utils/click-utils";
import {HttpUtils} from "../../utils/http-utils";

export class CategoryCreate {
    constructor(openNewRoute, categoryType) {
        ClickUtils.addEvents(window.location.pathname);
        this.categoryType = categoryType;
        this.findElements();
        this.openNewRoute = openNewRoute;
        this.createNewCategory().then();
    }

    findElements() {
        this.categoryNameInputElement = document.getElementById('categoryNameInput');
        this.createButtonElement = document.getElementById('create-button');
        this.createButtonElement.addEventListener('click', this.createButtonClick.bind(this));
    }

    async createButtonClick() {
        if (this.categoryNameInputElement.value !== '' && this.categoryNameInputElement.value.match(/[a-zа-я]/i)) {
            this.categoryNameInputElement.classList.remove('is-invalid');
            await this.createNewCategory();
            this.openNewRoute('/categories/' + this.categoryType);
        } else {
            this.categoryNameInputElement.classList.add('is-invalid');
        }
    }

    async createNewCategory() {
        const result = await HttpUtils.request(`/categories/${this.categoryType}/`, 'POST', true,
            {title: this.categoryNameInputElement.value});
        if (result.error) {
            console.log(result.response.message);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }
    }
}
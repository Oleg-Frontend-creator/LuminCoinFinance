import {ClickUtils} from "../../utils/click-utils";
import {HttpUtils} from "../../utils/http-utils";

export class ExpenseCreate {
    constructor(openNewRoute) {
        ClickUtils.addEvents(window.location.pathname);

        this.categoryNameInputElement = document.getElementById('categoryNameInput');
        this.createButtonElement = document.getElementById('create-button');
        this.createButtonElement.addEventListener('click', this.createButtonClick.bind(this));

        this.openNewRoute = openNewRoute;

        this.createNewCategory().then();
    }

    async createNewCategory() {
        const result = await HttpUtils.request('/categories/expense/', 'POST', true, {
            title: this.categoryNameInputElement.value
        });

        if (result.error) {
            console.log(result.response.message);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }
    }

    async createButtonClick(e) {
        if (this.categoryNameInputElement.value !== '' && this.categoryNameInputElement.value.match(/[a-zа-я]/i)) {
            this.categoryNameInputElement.classList.remove('is-invalid');
            e.preventDefault();
            await this.createNewCategory();
            this.openNewRoute('/categories/expense');
        } else {
            this.categoryNameInputElement.classList.add('is-invalid');
        }
    }
}
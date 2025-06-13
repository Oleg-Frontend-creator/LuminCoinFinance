import {ClickUtils} from "../../utils/click-utils";
import {HttpUtils} from "../../utils/http-utils";

export class CategoryList {
    constructor(openNewRoute, categoryType) {
        this.openNewRoute = openNewRoute;
        ClickUtils.addEvents(window.location.pathname);
        this.categoryType = categoryType;
        this.findElements();
        this.getExpenses.call(this).then();
    }

    findElements() {
        this.deleteCategoryButton = document.getElementById('delete-category-btn');
        this.deleteCategoryButton.addEventListener('click', this.deleteCategory.bind(this));
    }

    async getExpenses() {
        const result = await HttpUtils.request('/categories/' + this.categoryType);

        if (result.error) {
            console.log(result.response.message);
            if (result.redirect) {
                return result.redirect ? this.openNewRoute(result.redirect) : null;
            }
        }

        this.categoriesListElement = document.getElementById('category-list');
        if (result.response.length > 0) {
            for (let i = 0; i < result.response.length; i++) {
                const categoryElement = document.createElement('div');
                categoryElement.className = 'col mb-1 d-md-block d-flex justify-content-center';
                categoryElement.setAttribute('id', 'category-card-' + result.response[i].id);

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
                this.categoriesListElement.appendChild(categoryElement);
            }
        }

        this.categoriesListElement.innerHTML += '<div class="col mb-1 d-md-block d-flex justify-content-center" id="add-card">\n' +
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
    }

    setIdCategory(e) {
        this.modalElement = document.getElementById('modal-category');
        this.modalElement.style.display = 'block';
        this.modalElement.setAttribute('data-category-id', (e.target.parentElement.tagName === 'svg')
            ? e.target.parentElement.getAttribute('id') : e.target.getAttribute('id'));
    }

    async deleteCategory() {
        const id = this.modalElement.getAttribute('data-category-id');


        const result = await HttpUtils.request(`/categories/${this.categoryType}/${id}`, 'DELETE', true);

        if (result.error) {
            console.log(result.response.message);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        await this.deleteOperations(id);
        document.getElementById('category-card-' + id).remove();
        this.modalElement.style.display = 'none';
    }

    async deleteOperations(categoryId) {
        const category = await HttpUtils.request(`/categories/${this.categoryType}/${categoryId}`);
        const categoryName = category.response.title;

        const operations = await HttpUtils.request('/operations?period=interval&dateFrom=1000-01-01&dateTo=3000-01-01');

        operations.response.forEach(operation => {
            operation.category === categoryName ? HttpUtils.request('/operations/' + operation.id, 'DELETE', true) : '';
        });
    }
}
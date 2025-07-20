import {ClickUtils} from "../../utils/click-utils";
import {HttpUtils} from "../../utils/http-utils";
import {ResultResponseType} from "../../types/result-response.type";
import {CategoryResponseType} from "../../types/category-response.type";
import {OperationResponseType} from "../../types/operation-response.type";

export class CategoryList {
    private readonly openNewRoute: Function;
    private readonly categoryType: string;
    private readonly deleteCategoryButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('delete-category-btn');
    private readonly modalElement: HTMLElement = <HTMLElement>document.getElementById('modal-category');

    constructor(openNewRoute: Function, categoryType: string) {
        ClickUtils.addEvents(window.location.pathname);
        this.openNewRoute = openNewRoute;
        this.categoryType = categoryType;
        this.deleteCategoryButton.addEventListener('click', this.deleteCategory.bind(this));
        this.getExpenses.call(this).then();
    }

    private async getExpenses(): Promise<void> {
        const result: ResultResponseType = await HttpUtils.request('/categories/' + this.categoryType);

        if (result.error && result.redirect) {
            return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
        }

        const categoriesListElement: HTMLElement = <HTMLElement>document.getElementById('category-list');
        const categoriesExpense: CategoryResponseType[] = result.response;
        if (categoriesExpense.length > 0) {
            for (let i: number = 0; i < categoriesExpense.length; i++) {
                const categoryElement: HTMLElement = document.createElement('div');
                categoryElement.className = 'col mb-1 d-md-block d-flex justify-content-center';
                categoryElement.setAttribute('id', 'category-card-' + categoriesExpense[i].id);

                const cardElement: HTMLElement = document.createElement('div');
                cardElement.className = 'card p-1 mb-3 rounded-4';

                const cardBodyElement: HTMLElement = document.createElement('div');
                cardBodyElement.className = 'card-body';

                const cardTitleElement: HTMLElement = document.createElement('h5');
                cardTitleElement.className = 'card-title fs-3 fw-bold text-primary-emphasis';
                cardTitleElement.innerText = result.response[i].title;

                const editLinkElement: HTMLAnchorElement = document.createElement('a');
                editLinkElement.className = 'custom-page-link btn btn-primary me-2';
                editLinkElement.setAttribute('href', `/categories/${this.categoryType}/edit?id=${result.response[i].id}`);
                editLinkElement.innerText = 'Редактировать';

                const deleteButtonElement: HTMLButtonElement = document.createElement('button');
                deleteButtonElement.className = 'btn btn-danger delete-button';
                deleteButtonElement.setAttribute('type', 'button');
                deleteButtonElement.setAttribute('id', result.response[i].id.toString());
                deleteButtonElement.innerText = 'Удалить';

                cardBodyElement.appendChild(cardTitleElement);
                cardBodyElement.appendChild(editLinkElement);
                cardBodyElement.appendChild(deleteButtonElement);
                cardElement.appendChild(cardBodyElement);
                categoryElement.appendChild(cardElement);

                categoriesListElement.appendChild(categoryElement);
            }
        }

        categoriesListElement.innerHTML += '<div class="col mb-1 d-md-block d-flex justify-content-center" id="add-card">\n' +
            '        <a href="/categories/' + this.categoryType + '/create" class="custom-page-link card add-category-card p-1 mb-3 rounded-4 text-decoration-none">\n' +
            '            <div class="card-body d-flex justify-content-center align-items-center fs-2 text-opacity-50">\n' +
            '                +\n' +
            '            </div>\n' +
            '        </a>\n' +
            '    </div>';

        const deleteButtons: HTMLCollectionOf<HTMLButtonElement>
            = <HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName('delete-button');
        for (let i: number = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', this.setIdCategory.bind(this));
        }
    }

    private setIdCategory(e: Event | null): void {
        if (e && e.target) {
            this.modalElement.style.display = 'block';

            const targetElement: HTMLElement | null = <HTMLElement | null>e.target;
            const targetParentElement: HTMLElement | null | undefined = targetElement?.parentElement;
            if (targetParentElement && targetParentElement.tagName === 'svg' && targetParentElement.getAttribute('id')) {
                this.modalElement.setAttribute('data-category-id', targetParentElement.getAttribute('id') as string);
            } else if (targetParentElement && targetParentElement.tagName !== 'svg' && targetElement?.getAttribute('id')) {
                this.modalElement.setAttribute('data-category-id', targetElement.getAttribute('id') as string);
            }
        }
    }

    private async deleteCategory(): Promise<void> {
        const id: string | null = this.modalElement.getAttribute('data-category-id');

        const result: ResultResponseType = await HttpUtils.request(`/categories/${this.categoryType}/${id}`, 'DELETE', true);

        if (result.error) {
            return result.redirect ? this.openNewRoute(result.redirect) : console.log(result.response.message);
        }

        if (id) {
            await this.deleteOperations(id);
            document.getElementById('category-card-' + id)?.remove();
        }
        this.modalElement.style.display = 'none';
    }

    private async deleteOperations(categoryId: string): Promise<void> {
        const category: ResultResponseType = await HttpUtils.request(`/categories/${this.categoryType}/${categoryId}`);
        const categoryName = category.response.title;

        const response: ResultResponseType = await HttpUtils.request('/operations?period=interval&dateFrom=1000-01-01&dateTo=3000-01-01');
        const operations: OperationResponseType[] | null = response.response;
        if (operations)
            operations.forEach(operation => {
                operation.category === categoryName ? HttpUtils.request('/operations/' + operation.id, 'DELETE', true) : '';
            });
    }
}
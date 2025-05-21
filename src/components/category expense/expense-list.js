import {ClickUtils} from "../../utils/click-utils";
import {HttpUtils} from "../../utils/http-utils";

export class ExpenseList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        ClickUtils.addEvents(window.location.pathname);
        this.deletingIdCategory = null;
        this.deleteCategoryButton = document.getElementById('delete-category-btn');
        this.deleteCategoryButton.addEventListener('click', this.deleteCategory.bind(this));
        this.getExpenses.call(this).then();
    }

    async getExpenses() {
        const result = await HttpUtils.request('/categories/expense');

        if (result.error) {
            console.log(result.response.message);
            if (result.redirect) {
                return result.redirect ? this.openNewRoute(result.redirect) : null;
            }
        }

        this.expensesListElement = document.getElementById('expense-list');
        if (result.response.length > 0) {
            for (let i = 0; i < result.response.length; i++) {
                const expenseElement = document.createElement('div');
                expenseElement.className = 'col mb-1 d-md-block d-flex justify-content-center';
                expenseElement.setAttribute('id', 'expense-card-' + result.response[i].id);

                const cardElement = document.createElement('div');
                cardElement.className = 'card p-1 mb-3 rounded-4';

                const cardBodyElement = document.createElement('div');
                cardBodyElement.className = 'card-body';

                const cardTitleElement = document.createElement('h5');
                cardTitleElement.className = 'card-title fs-3 fw-bold text-primary-emphasis';
                cardTitleElement.innerText = result.response[i].title;

                const editLinkElement = document.createElement('a');
                editLinkElement.className = 'custom-page-link btn btn-primary me-2';
                editLinkElement.setAttribute('href', '/categories/expense/edit?id=' + result.response[i].id);
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
                expenseElement.appendChild(cardElement);
                this.expensesListElement.appendChild(expenseElement);
            }

            const deleteButtons = document.getElementsByClassName('delete-button');
            for (let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].addEventListener('click', () => {
                    console.log(1)
                });
            }
        }

        this.expensesListElement.innerHTML += '<div class="col mb-1 d-md-block d-flex justify-content-center" id="add-card">\n' +
            '        <a href="/categories/expense/create" class="custom-page-link card add-category-card p-1 mb-3 rounded-4 text-decoration-none">\n' +
            '            <div class="card-body d-flex justify-content-center align-items-center fs-2 text-opacity-50">\n' +
            '                +\n' +
            '            </div>\n' +
            '        </a>\n' +
            '    </div>';

        const deleteBtns = document.getElementsByClassName('delete-button');
        for (let i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].addEventListener('click', this.setIdCategory.bind(this));
        }
    }

    setIdCategory(e) {
        this.modalElement = document.getElementById('modal');
        this.modalElement.style.display = 'block';
        this.modalElement.setAttribute('data-category-id', e.target.getAttribute('id'));
    }

    async deleteCategory() {
        const id = this.modalElement.getAttribute('data-category-id');
        const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);

        if (result.error) {
            console.log(result.response.message);
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        document.getElementById('expense-card-' + id).remove();

        this.modalElement.style.display = 'none';
    }

}
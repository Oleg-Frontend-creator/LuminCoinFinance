import {ClickUtils} from "../../utils/click-utils";
import {HttpUtils} from "../../utils/http-utils";

export class IncomeList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        ClickUtils.addEvents(window.location.pathname);
        this.getIncomes().then();
    }

    async getIncomes() {
        const result = await HttpUtils.request('/categories/income');

        if (result.error) {
            console.log(result.response.message);
            if (result.redirect) {
                return result.redirect ? this.openNewRoute(result.redirect) : null;
            }
        }

        if (result.response.length > 0) {
            this.incomesListElement = document.getElementById('incomes-list');
            for (let i = 0; i < result.response.length; i++) {
                const incomeElement = document.createElement('div');
                incomeElement.className = 'col mb-1 d-md-block d-flex justify-content-center';

                const cardElement = document.createElement('div');
                cardElement.className = 'card p-1 mb-3 rounded-4';

                const cardBodyElement = document.createElement('div');
                cardBodyElement.className = 'card-body';

                const cardTitleElement = document.createElement('h5');
                cardTitleElement.className = 'card-title fs-3 fw-bold text-primary-emphasis';
                cardTitleElement.innerText = result.response[i].title;

                const editLinkElement = document.createElement('a');
                editLinkElement.className = 'custom-page-link btn btn-primary me-2';
                editLinkElement.setAttribute('href', '/categories/income/edit?id=' + (i + 1).toString());
                editLinkElement.innerText = 'Редактировать';

                const deleteButtonElement = document.createElement('button');
                deleteButtonElement.className = 'btn btn-danger';
                deleteButtonElement.setAttribute('type', 'button');
                deleteButtonElement.setAttribute('data-bs-toggle', 'modal');
                deleteButtonElement.setAttribute('data-bs-target', '#staticBackdrop');
                deleteButtonElement.setAttribute('id', (i + 1).toString());
                deleteButtonElement.innerText = 'Удалить';

                cardBodyElement.appendChild(cardTitleElement);
                cardBodyElement.appendChild(editLinkElement);
                cardBodyElement.appendChild(deleteButtonElement);
                cardElement.appendChild(cardBodyElement);
                incomeElement.appendChild(cardElement);
                this.incomesListElement.appendChild(incomeElement);
            }

            this.incomesListElement.innerHTML += '<div class="col mb-1 d-md-block d-flex justify-content-center" id="add-card">\n' +
                '        <a href="/categories/income/create" class="custom-page-link card add-category-card p-1 mb-3 rounded-4 text-decoration-none">\n' +
                '            <div class="card-body d-flex justify-content-center align-items-center fs-2 text-opacity-50">\n' +
                '                +\n' +
                '            </div>\n' +
                '        </a>\n' +
                '    </div>';
        }
    }
}
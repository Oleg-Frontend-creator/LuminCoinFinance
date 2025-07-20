"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickUtils = void 0;
class ClickUtils {
    static addEvents(path) {
        this.addMenuLayoutEvents(path);
        this.addModalEvents();
    }
    static addMenuLayoutEvents(path) {
        const menuElement = document.getElementById('menu');
        const personNameElement = document.getElementById('person-name');
        const logoutButton = document.getElementById('logout-btn');
        const burgerDivElement = document.getElementById('burger');
        const closeDivElement = document.getElementById('close');
        const personIconElement = document.getElementById('person-icon');
        if (menuElement) {
            burgerDivElement.addEventListener("click", () => menuElement.classList.add('open'));
            closeDivElement.addEventListener("click", () => menuElement.classList.remove('open'));
        }
        personIconElement.addEventListener("click", () => {
            if (personNameElement)
                if (personNameElement.classList.contains('logout')) {
                    logoutButton.classList.remove('active');
                    personNameElement.classList.remove('logout');
                }
                else {
                    logoutButton.classList.add('active');
                    personNameElement.classList.add('logout');
                }
        });
        const pageLinkElements = document.querySelectorAll('.custom-page-link');
        const expenseCategoryLinks = ['/categories/expense/create', '/categories/expense/edit'];
        const incomeCategoryLinks = ['/categories/income/create', '/categories/income/edit'];
        const operationLinks = ['/operations/create', '/operations/edit'];
        const toggleButtonElement = document.getElementById('toggle-btn');
        const toggleButtonChildElement = document.getElementById('home-collapse');
        for (let i = 0; i < pageLinkElements.length; i++) {
            if (pageLinkElements[i].getAttribute('href') === path) {
                pageLinkElements[i].classList.add('active');
                if (path.includes('/categories/income') || path.includes('/categories/expense')) {
                    toggleButtonElement.setAttribute('aria-expanded', 'true');
                    toggleButtonChildElement.classList.add('show');
                }
            }
            else if (expenseCategoryLinks.includes(path) && pageLinkElements[i].getAttribute('href') === '/categories/expense' ||
                incomeCategoryLinks.includes(path) && pageLinkElements[i].getAttribute('href') === '/categories/income') {
                pageLinkElements[i].classList.add('active');
                toggleButtonElement.setAttribute('aria-expanded', 'true');
                toggleButtonChildElement.classList.add('show');
            }
            else if (operationLinks.includes(path) && pageLinkElements[i].getAttribute('href') === '/operations') {
                pageLinkElements[i].classList.add('active');
            }
            else {
                pageLinkElements[i].classList.remove('active');
            }
        }
    }
    static addModalEvents() {
        document.getElementById('modal-category-close-button').addEventListener('click', () => document.getElementById('modal-category').style.display = 'none');
        document.getElementById('modal-operation-close-button').addEventListener('click', () => {
            document.getElementById('modal-operation').style.display = 'none';
        });
    }
}
exports.ClickUtils = ClickUtils;
//# sourceMappingURL=click-utils.js.map
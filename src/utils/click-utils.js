export class ClickUtils {
    static addEvents(path) {
        document.getElementById('burger').onclick = function () {
            document.getElementById('menu').classList.add('open');
        }
        document.getElementById('close').addEventListener("click", () => {
            document.getElementById('menu').classList.remove('open');
        });

        document.getElementById('person-icon').addEventListener("click", () => {
            if (document.getElementById('person-name').classList.contains('logout')) {
                document.getElementById('person-name').classList.remove('logout');
                document.getElementById('logout-btn').classList.remove('active');
            } else {
                document.getElementById('person-name').classList.add('logout');
                document.getElementById('logout-link').classList.add('active');
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
            } else if (expenseCategoryLinks.includes(path) && pageLinkElements[i].getAttribute('href') === '/categories/expense' ||
                incomeCategoryLinks.includes(path) && pageLinkElements[i].getAttribute('href') === '/categories/income') {
                pageLinkElements[i].classList.add('active');
                toggleButtonElement.setAttribute('aria-expanded', 'true');
                toggleButtonChildElement.classList.add('show');
            } else if (operationLinks.includes(path) && pageLinkElements[i].getAttribute('href') === '/operations') {
                pageLinkElements[i].classList.add('active');
            } else {
                pageLinkElements[i].classList.remove('active');
            }
        }
    }
}
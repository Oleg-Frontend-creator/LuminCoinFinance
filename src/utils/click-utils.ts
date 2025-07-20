export class ClickUtils {
    public static addEvents(path: string) {
        this.addMenuLayoutEvents(path);
        this.addModalEvents();
    }

    private static addMenuLayoutEvents(path: string): void {
        const menuElement: HTMLElement | null = document.getElementById('menu');
        const personNameElement: HTMLSpanElement | null = document.getElementById('person-name');
        const logoutButton: HTMLAnchorElement | null = <HTMLAnchorElement>document.getElementById('logout-btn');
        const burgerDivElement: HTMLDivElement | null = <HTMLDivElement>document.getElementById('burger');
        const closeDivElement: HTMLDivElement | null = <HTMLDivElement>document.getElementById('close');
        const personIconElement: HTMLImageElement | null = <HTMLImageElement>document.getElementById('person-icon');
        if (menuElement) {
            burgerDivElement.addEventListener("click", () => menuElement.classList.add('open'));
            closeDivElement.addEventListener("click", () => menuElement.classList.remove('open'));
        }

        personIconElement.addEventListener("click", () => {
            if (personNameElement)
                if (personNameElement.classList.contains('logout')) {
                    logoutButton.classList.remove('active');
                    personNameElement.classList.remove('logout');
                } else {
                    logoutButton.classList.add('active');
                    personNameElement.classList.add('logout');
                }
        });

        const pageLinkElements: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.custom-page-link');
        const expenseCategoryLinks: string[] = ['/categories/expense/create', '/categories/expense/edit'];
        const incomeCategoryLinks: string[] = ['/categories/income/create', '/categories/income/edit'];
        const operationLinks: string[] = ['/operations/create', '/operations/edit'];

        const toggleButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById('toggle-btn');
        const toggleButtonChildElement: HTMLElement = <HTMLElement>document.getElementById('home-collapse');
        for (let i: number = 0; i < pageLinkElements.length; i++) {
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

    private static addModalEvents(): void {
        (document.getElementById('modal-category-close-button') as HTMLButtonElement).addEventListener('click', () =>
            (document.getElementById('modal-category') as HTMLElement).style.display = 'none');

        (document.getElementById('modal-operation-close-button') as HTMLButtonElement).addEventListener('click', () => {
            (document.getElementById('modal-operation') as HTMLElement).style.display = 'none';
        });
    }
}
import {MainPage} from "./src/components/main-page";
import {FileUtils} from "./src/utils/file-utils";
import {ExpenseList} from "./src/components/category expense/expense-list";
import {ExpenseCreate} from "./src/components/category expense/expense-create";
import {ExpenseEdit} from "./src/components/category expense/expense-edit";
import {IncomeList} from "./src/components/category income/income-list";
import {IncomeCreate} from "./src/components/category income/income-create";
import {IncomeEdit} from "./src/components/category income/income-edit";
import {OperationList} from "./src/components/operations/operation-list";
import {OperationCreate} from "./src/components/operations/operation-create";
import {OperationEdit} from "./src/components/operations/operation-edit";
import {OperationDelete} from "./src/components/operations/operation-delete";
import {IncomeDelete} from "./src/components/category income/income-delete";
import {ExpenseDelete} from "./src/components/category expense/expense-delete";
import {SignUp} from "./src/components/auth/sign-up";
import {Logout} from "./src/components/auth/logout";
import {Login} from "./src/components/auth/login";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.titleMainPageElement = document.getElementById('page-title');
        this.contentPageElement = document.getElementById('content');
        this.userName = null;

        this.routes = [
            {
                route: '/',
                title: 'LuminСoin Finance',
                filePathTemplate: '/templates/pages/main-page.html',
                load: () => {
                    new MainPage();
                },
                useLayout: '/templates/layout.html',
                scripts: [
                        'chart.umd.js'
                    ]
            },
            {
                route: '/incomes',
                title: 'Cash income',
                filePathTemplate: '/templates/pages/category income/list.html',
                load: () => {
                    new IncomeList();
                },
                useLayout: '/templates/layout.html'
            },
            {
                route: '/income/create',
                title: 'Cash income - create',
                filePathTemplate: '/templates/pages/category income/create.html',
                load: () => {
                    new IncomeCreate();
                },
                useLayout: '/templates/layout.html'
            },
            {
                route: '/income/edit',
                title: 'Cash income - edit',
                filePathTemplate: '/templates/pages/category income/edit.html',
                load: () => {
                    new IncomeEdit();
                },
                useLayout: '/templates/layout.html'
            },
            {
                route: '/income/edit',
                title: 'Cash income - edit',
                filePathTemplate: '/templates/pages/category income/edit.html',
                load: () => {
                    new IncomeEdit();
                },
                useLayout: '/templates/layout.html'
            },
            {
                route: '/income/delete',
                load: () => {
                    new IncomeDelete();
                }
            },
            {
                route: '/expenses',
                title: 'Cash expense',
                filePathTemplate: '/templates/pages/category expense/list.html',
                load: () => {
                    new ExpenseList();
                },
                useLayout: '/templates/layout.html'
            },
            {
                route: '/expense/create',
                title: 'Cash expense - create',
                filePathTemplate: '/templates/pages/category expense/create.html',
                load: () => {
                    new ExpenseCreate();
                },
                useLayout: '/templates/layout.html'
            },
            {
                route: '/expense/edit',
                title: 'Cash expense - edit',
                filePathTemplate: '/templates/pages/category expense/edit.html',
                load: () => {
                    new ExpenseEdit();
                },
                useLayout: '/templates/layout.html'
            },
            {
                route: '/expense/delete',
                load: () => {
                    new ExpenseDelete();
                }
            },
            {
                route: '/operations',
                title: 'Operations',
                filePathTemplate: '/templates/pages/operations/list.html',
                load: () => {
                    new OperationList();
                },
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations/create',
                title: 'Create operation',
                filePathTemplate: '/templates/pages/operations/create.html',
                load: () => {
                    new OperationCreate();
                },
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations/edit',
                title: 'Update operation',
                filePathTemplate: '/templates/pages/operations/edit.html',
                load: () => {
                    new OperationEdit();
                },
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations/delete',
                load: () => {
                    new OperationDelete();
                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.className = "d-flex align-items-center py-4 bg-body-tertiary justify-content-center";
                    document.body.style.height = "100vh";
                    new Login();
                },
                unload: () => {
                    document.body.className = " ";
                    document.body.style.height = "auto";
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.className = "d-flex align-items-center py-4 bg-body-tertiary justify-content-center";
                    document.body.style.height = "100vh";
                    new SignUp();
                },
                unload: () => {
                    document.body.className = " ";
                    document.body.style.height = "auto";
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/logout',
                load: () => {
                    new Logout();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false
            }
        ];

        this.initEvents();
    }

    initEvents() {
        window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
        window.addEventListener("popstate", this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();
            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || currentRoute === url.replace('#', '') || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }

    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) { //очистка прошлого роута для последующей загрузки страницы без миллиона link со стилями
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => { //удаляем стили от прошлой страницы
                    // document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => { //удаляем скрипты от прошлой страницы
                    document.querySelector(`script[src='/js/${script}']`).remove();
                });
            }
            if (currentRoute.unload && typeof currentRoute.unload === "function") {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            // if (newRoute.styles && newRoute.styles.length > 0) {
            //     newRoute.styles.forEach(style => FileUtils.loadPageStyle('/css/' + style, this.adminlteStyleElement));
            // }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | LuminCoin Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-block');
                    this.activateMenuItem(newRoute);
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }


            if (newRoute.load && typeof newRoute.load === "function") {
                newRoute.load();
            }

        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }

    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}
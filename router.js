import {MainPage} from "./src/components/main-page";
import {FileUtils} from "./src/utils/file-utils";
import {OperationList} from "./src/components/operations/operation-list";
import {OperationCreate} from "./src/components/operations/operation-create";
import {OperationEdit} from "./src/components/operations/operation-edit";
import {SignUp} from "./src/components/auth/sign-up";
import {Logout} from "./src/components/auth/logout";
import {Login} from "./src/components/auth/login";
import {AuthUtils} from "./src/utils/auth-utils";
import {HttpUtils} from "./src/utils/http-utils";
import {CategoryCreate} from "./src/components/category/category-create";
import {CategoryEdit} from "./src/components/category/category-edit";
import {CategoryList} from "./src/components/category/category-list";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main-page.html',
                load: () => new MainPage(this.openNewRoute.bind(this)),
                useLayout: '/templates/layout.html',
                scripts: [
                    'chart.umd.js'
                ]
            },
            {
                route: '/categories/income',
                title: 'Категория доходов',
                filePathTemplate: '/templates/pages/category income/list.html',
                load: () => new CategoryList(this.openNewRoute.bind(this), 'income'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/categories/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/category income/create.html',
                load: () => new CategoryCreate(this.openNewRoute.bind(this), 'income'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/categories/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/category income/edit.html',
                load: () => new CategoryEdit(this.openNewRoute.bind(this), 'income'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/categories/expense',
                title: 'Категория расходов',
                filePathTemplate: '/templates/pages/category expense/list.html',
                load: () => new CategoryList(this.openNewRoute.bind(this), 'expense'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/categories/expense/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/category expense/create.html',
                load: () => new CategoryCreate(this.openNewRoute.bind(this), 'expense'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/categories/expense/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/category expense/edit.html',
                load: () => new CategoryEdit(this.openNewRoute.bind(this), 'expense'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations',
                title: 'Операции',
                filePathTemplate: '/templates/pages/operations/list.html',
                load: () => new OperationList(this.openNewRoute.bind(this)),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations/create',
                title: 'Создание операции',
                filePathTemplate: '/templates/pages/operations/create.html',
                load: () => new OperationCreate(this.openNewRoute.bind(this)),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations/edit',
                title: 'Обновление операции',
                filePathTemplate: '/templates/pages/operations/edit.html',
                load: () => new OperationEdit(this.openNewRoute.bind(this)),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.className = "d-flex align-items-center py-4 bg-body-tertiary justify-content-center";
                    document.body.style.height = "100vh";
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.className = " ";
                    document.body.style.height = "auto";
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.className = "d-flex align-items-center py-4 bg-body-tertiary justify-content-center";
                    document.body.style.height = "100vh";
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.className = " ";
                    document.body.style.height = "auto";
                }
            },
            {
                route: '/logout',
                load: () => new Logout(this.openNewRoute.bind(this))
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
        if ((!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey))
            && url !== '/signup') {
            localStorage.clear();
            url = '/login';
        }
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
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => document.querySelector(`script[src='/js/${script}']`).remove());
            }
            if (currentRoute.unload && typeof currentRoute.unload === "function") {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
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
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());

                await this.setUserBalance(AuthUtils.getAuthInfo(AuthUtils.accessTokenKey), AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey));
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

    async setUserBalance(accessToken, refreshToken) {
        const result = await HttpUtils.request('/balance');

        if (result.error || !result.response) {
            console.log(result.response.message)
            return false;
        }

        const userInfo = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey));
        if (userInfo) {
            userInfo.balance = result.response.balance;
            AuthUtils.setAuthInfo(null, null, JSON.stringify(userInfo));
        }

        document.getElementById('person-name').innerText =
            (!userInfo.name && !userInfo.lastName) ? 'Пользователь' : userInfo.name + ' ' + userInfo.lastName;
        document.getElementById('balance-number').innerText =
            (userInfo.balance === 0) ? '0$' : userInfo.balance + '$';
    }
}
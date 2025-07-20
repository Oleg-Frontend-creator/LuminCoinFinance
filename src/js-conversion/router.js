"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const main_page_1 = require("./src/components/main-page");
const file_utils_1 = require("./src/utils/file-utils");
const operation_list_1 = require("./src/components/operations/operation-list");
const operation_create_1 = require("./src/components/operations/operation-create");
const operation_edit_1 = require("./src/components/operations/operation-edit");
const sign_up_1 = require("./src/components/auth/sign-up");
const logout_1 = require("./src/components/auth/logout");
const login_1 = require("./src/components/auth/login");
const auth_utils_1 = require("./src/utils/auth-utils");
const http_utils_1 = require("./src/utils/http-utils");
const category_create_1 = require("./src/components/category/category-create");
const category_edit_1 = require("./src/components/category/category-edit");
const category_list_1 = require("./src/components/category/category-list");
class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main-page.html',
                load: () => new main_page_1.MainPage(this.openNewRoute.bind(this)),
                useLayout: '/templates/layout.html',
                scripts: [
                    'chart.umd.js'
                ]
            },
            {
                route: '/categories/income',
                title: 'Категория доходов',
                filePathTemplate: '/templates/pages/category income/list.html',
                load: () => new category_list_1.CategoryList(this.openNewRoute.bind(this), 'income'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/categories/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/category income/create.html',
                load: () => new category_create_1.CategoryCreate(this.openNewRoute.bind(this), 'income'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/categories/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/category income/edit.html',
                load: () => new category_edit_1.CategoryEdit(this.openNewRoute.bind(this), 'income'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/categories/expense',
                title: 'Категория расходов',
                filePathTemplate: '/templates/pages/category expense/list.html',
                load: () => new category_list_1.CategoryList(this.openNewRoute.bind(this), 'expense'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/categories/expense/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/category expense/create.html',
                load: () => new category_create_1.CategoryCreate(this.openNewRoute.bind(this), 'expense'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/categories/expense/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/category expense/edit.html',
                load: () => new category_edit_1.CategoryEdit(this.openNewRoute.bind(this), 'expense'),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations',
                title: 'Операции',
                filePathTemplate: '/templates/pages/operations/list.html',
                load: () => new operation_list_1.OperationList(this.openNewRoute.bind(this)),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations/create',
                title: 'Создание операции',
                filePathTemplate: '/templates/pages/operations/create.html',
                load: () => new operation_create_1.OperationCreate(this.openNewRoute.bind(this)),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations/edit',
                title: 'Обновление операции',
                filePathTemplate: '/templates/pages/operations/edit.html',
                load: () => new operation_edit_1.OperationEdit(this.openNewRoute.bind(this)),
                useLayout: '/templates/layout.html'
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new login_1.Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new sign_up_1.SignUp(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                load: () => new logout_1.Logout(this.openNewRoute.bind(this))
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
        window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this, null, null));
        window.addEventListener("popstate", this.activateRoute.bind(this, null, null));
        document.addEventListener('click', this.clickHandler.bind(this));
    }
    openNewRoute(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((!auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.accessTokenKey) || !auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.refreshTokenKey))
                && url !== '/signup') {
                localStorage.clear();
                url = '/login';
            }
            const currentRoute = window.location.pathname;
            history.pushState({}, '', url);
            yield this.activateRoute(null, currentRoute);
        });
    }
    clickHandler(e) {
        return __awaiter(this, void 0, void 0, function* () {
            let element = null;
            if (e) {
                const node = e.target;
                const parentNode = node.parentNode;
                if (node) {
                    if (node.nodeName === 'A') {
                        element = node;
                    }
                    else if (parentNode && parentNode.nodeName === 'A') {
                        element = parentNode;
                    }
                }
                if (element) {
                    e.preventDefault();
                    const currentRoute = window.location.pathname;
                    const url = element.href.replace(window.location.origin, '');
                    if (!url || currentRoute === url.replace('#', '') || url.startsWith('javascript:void(0)')) {
                        return;
                    }
                    yield this.openNewRoute(url);
                }
            }
        });
    }
    activateRoute(e, oldRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oldRoute) { //очистка прошлого роута для последующей загрузки страницы без миллиона link со стилями
                const currentRoute = this.routes.find(item => item.route === oldRoute);
                if (currentRoute) {
                    if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                        currentRoute.scripts.forEach((script) => {
                            const scriptLinkElement = document.querySelector(`script[src='/js/${script}']`);
                            if (scriptLinkElement)
                                scriptLinkElement.remove();
                        });
                    }
                }
            }
            const urlRoute = window.location.pathname;
            const newRoute = this.routes.find(item => item.route === urlRoute);
            if (newRoute) {
                if (newRoute.scripts && newRoute.scripts.length > 0) {
                    for (const script of newRoute.scripts) {
                        yield file_utils_1.FileUtils.loadPageScript('/js/' + script);
                    }
                }
                if (newRoute.title && this.titlePageElement) {
                    this.titlePageElement.innerText = newRoute.title + ' | LuminCoin Finance';
                }
                if (newRoute.filePathTemplate && this.contentPageElement) {
                    if (newRoute.useLayout) {
                        this.contentPageElement.innerHTML = yield fetch(newRoute.useLayout).then(response => response.text());
                        this.contentPageElement = document.getElementById('content-block');
                    }
                    if (this.contentPageElement)
                        this.contentPageElement.innerHTML = yield fetch(newRoute.filePathTemplate).then(response => response.text());
                    yield this.setUserBalance(auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.accessTokenKey), auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.refreshTokenKey));
                }
                if (newRoute.load && typeof newRoute.load === "function") {
                    newRoute.load();
                }
            }
            else {
                console.log('No route found');
                history.pushState({}, '', '/404');
                yield this.activateRoute(null, null);
            }
        });
    }
    setUserBalance(accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request('/balance');
            const response = result.response;
            const userInfo = JSON.parse(auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.userInfoTokenKey));
            if (userInfo) {
                userInfo.balance = response.balance;
                auth_utils_1.AuthUtils.setAuthInfo({ userInfo: JSON.stringify(userInfo) });
                const personNameElement = document.getElementById('person-name');
                if (personNameElement)
                    personNameElement.innerText = (!userInfo.name && !userInfo.lastName) ?
                        'Пользователь' : userInfo.name + ' ' + userInfo.lastName;
                const balanceNumberElement = document.getElementById('balance-number');
                if (balanceNumberElement)
                    balanceNumberElement.innerText = (userInfo.balance === 0) ? '0$' : userInfo.balance + '$';
            }
        });
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map
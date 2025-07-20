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
import {RouteType} from "./src/types/route.type";
import {BalanceResponseType} from "./src/types/balance-response.type";
import {UserInfoType} from "./src/types/user-info.type";
import {ResultResponseType} from "./src/types/result-response.type";

export class Router {
    readonly titlePageElement: HTMLElement | null;
    private contentPageElement: HTMLElement | null;

    private routes: RouteType[];

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
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                useLayout: false,
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

    private initEvents(): void {
        window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this, null, null));
        window.addEventListener("popstate", this.activateRoute.bind(this, null, null));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    public async openNewRoute(url: string): Promise<void> {
        if ((!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey))
            && url !== '/signup') {
            localStorage.clear();
            url = '/login';
        }
        const currentRoute: string | null = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    private async clickHandler(e: Event | null): Promise<void> {
        let element: HTMLAnchorElement | null = null;
        if (e) {
            const node: Node | null = <Node>e.target;
            const parentNode: ParentNode | null = node.parentNode;
            if (node) {
                if (node.nodeName === 'A') {
                    element = <HTMLAnchorElement>node;
                } else if (parentNode && parentNode.nodeName === 'A') {
                    element = <HTMLAnchorElement>parentNode;
                }
            }

            if (element) {
                e.preventDefault();
                const currentRoute: string = window.location.pathname;
                const url: string = element.href.replace(window.location.origin, '');
                if (!url || currentRoute === url.replace('#', '') || url.startsWith('javascript:void(0)')) {
                    return;
                }
                await this.openNewRoute(url);
            }
        }
    }

    private async activateRoute(e: Event | null, oldRoute: string | null): Promise<void> {
        if (oldRoute) { //очистка прошлого роута для последующей загрузки страницы без миллиона link со стилями
            const currentRoute: RouteType | undefined = this.routes.find(item => item.route === oldRoute);
            if (currentRoute) {
                if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                    currentRoute.scripts.forEach((script: string) => {
                        const scriptLinkElement: HTMLScriptElement | null = document.querySelector(`script[src='/js/${script}']`);
                        if (scriptLinkElement)
                            scriptLinkElement.remove();
                    });
                }
            }
        }

        const urlRoute: string = window.location.pathname;
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }
            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title + ' | LuminCoin Finance';
            }
            if (newRoute.filePathTemplate && this.contentPageElement) {
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    this.contentPageElement = document.getElementById('content-block');
                } else {
                    this.contentPageElement = document.getElementById('content');
                }
                if (this.contentPageElement)
                    this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());

                await this.setUserBalance(<string>AuthUtils.getAuthInfo(AuthUtils.accessTokenKey),
                    <string>AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey));
            }
            if (newRoute.load && typeof newRoute.load === "function") {
                newRoute.load();
            }

        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute(null, null);
        }
    }

    private async setUserBalance(accessToken: string, refreshToken: string): Promise<void> {
        const result: ResultResponseType = await HttpUtils.request('/balance');
        const response: BalanceResponseType | null = result.response;
        const userInfo: UserInfoType | null = JSON.parse(<string>AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey));
        if (userInfo) {
            if (response)
                userInfo.balance = response.balance;
            else
                userInfo.balance = 0;
            AuthUtils.setAuthInfo({userInfo: JSON.stringify(userInfo)});

            const personNameElement: HTMLElement | null = document.getElementById('person-name');
            if (personNameElement)
                personNameElement.innerText = (!userInfo.name && !userInfo.lastName) ?
                    'Пользователь' : userInfo.name + ' ' + userInfo.lastName;

            const balanceNumberElement: HTMLElement | null = document.getElementById('balance-number');
            if (balanceNumberElement)
                balanceNumberElement.innerText = (userInfo.balance === 0) ? '0$' : userInfo.balance + '$';
        }


    }
}
import {ClickUtils} from "../utils/click-utils";
import {AuthUtils} from "../utils/auth-utils";

export class MainPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.init();
    }

    init() {
        if (!AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login');
        }

        (new Chart(document.getElementById('pie-chart-income'), {
            type: 'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1
                }]
            },
            padding: '40px'
        }));
        (new Chart(document.getElementById('pie-chart-expenses'), {
            type: 'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1
                }]
            },
            padding: '40px'
        }));

        ClickUtils.addEvents(window.location.pathname);
    }
}
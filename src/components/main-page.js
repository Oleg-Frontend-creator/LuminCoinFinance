import {ClickUtils} from "../utils/click-utils";

export class MainPage {
    constructor() {
        this.init();
    }

    init() {
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
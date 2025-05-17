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
        //бургерное меню на адаптив

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
                document.getElementById('logout-btn').classList.add('active');
            }
        });
    }
}
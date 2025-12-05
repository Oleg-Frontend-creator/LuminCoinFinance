import {ClickUtils} from "../utils/click-utils";
import {DateValidateUtils} from "../utils/date-validate-utils";
import {HttpUtils} from "../utils/http-utils";

export class MainPage {
    constructor(openNewRoute) {
        ClickUtils.addEvents(window.location.pathname);
        this.openNewRoute = openNewRoute;
        this.findAllElements();
        this.setAllEvents();
        this.allTimeBtn.click();
    }

    findAllElements() {
        this.timeBtns = document.getElementsByClassName('time-btn');
        this.intervalPrevCalendar = document.getElementById('interval-prev-time-btn');
        this.intervalNextCalendar = document.getElementById('interval-next-time-btn');
        this.intervalPrevSpan = document.getElementById('interval-prev-time-span');
        this.intervalNextSpan = document.getElementById('interval-next-time-span');

        this.todayTimeBtn = document.getElementById('today-time-btn');
        this.weekTimeBtn = document.getElementById('week-time-btn');
        this.monthTimeBtn = document.getElementById('month-time-btn');
        this.yearTimeBtn = document.getElementById('year-time-btn');
        this.allTimeBtn = document.getElementById('all-time-btn');
        this.intervalTimeBtn = document.getElementById('interval-time-btn');
    }

    setAllEvents() {
        this.todayTimeBtn.addEventListener('click', (e) => {
            this.removeIntervalStyles();
            e.target.classList.add('active');
            const currentDate = `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getUTCDate()}`;
            this.fillCharts.call(this, {
                period: "interval",
                dateFrom: currentDate,
                dateTo: currentDate
            }).then();
        });

        this.weekTimeBtn.addEventListener('click', (e) => {
            this.removeIntervalStyles();
            e.target.classList.add('active');
            const currentYear = (new Date()).getFullYear();
            const currentMonth = (new Date()).getMonth() + 1;
            const currentDay = (new Date()).getUTCDate();

            if (currentDay < 7) {
                if (currentMonth === 1) {
                    this.fillCharts.call(this, {
                        period: "interval",
                        dateFrom: `${currentYear - 1}-01-${31 - (6 - currentDay)}`,
                        dateTo: `${currentYear}-${currentMonth}-${currentDay}`
                    }).then();
                } else {
                    const daysInPrevMonth = DateValidateUtils.getNumberDaysFromCurrentMonth(currentYear, currentMonth - 1);
                    this.fillCharts.call(this, {
                        period: "interval",
                        dateFrom: `${currentYear}-${currentMonth - 1}-${daysInPrevMonth - (6 - currentDay)}`,
                        dateTo: `${currentYear}-${currentMonth}-${currentDay}`
                    }).then();
                }
            } else {
                this.fillCharts.call(this, {
                    period: "interval",
                    dateFrom: `${currentYear}-${currentMonth}-${currentDay - 6}`,
                    dateTo: `${currentYear}-${currentMonth}-${currentDay}`
                }).then();
            }
        });

        this.monthTimeBtn.addEventListener('click', (e) => {
            this.removeIntervalStyles();
            e.target.classList.add('active');
            const currentYear = (new Date()).getFullYear();
            const currentMonth = (new Date()).getMonth() + 1;
            const currentDay = (new Date()).getUTCDate();

            const daysInPrevMonth = DateValidateUtils.getNumberDaysFromCurrentMonth(currentYear, currentMonth - 1);
            const daysInCurrentMonth = DateValidateUtils.getNumberDaysFromCurrentMonth(currentYear, currentMonth);

            if (daysInPrevMonth === currentDay) {
                return this.fillCharts.call(this, {
                    period: "interval",
                    dateFrom: `${currentYear}-${currentMonth}-01`,
                    dateTo: `${currentYear}-${currentMonth}-${daysInCurrentMonth}`
                }).then();
            }

            if (currentMonth === 1) {
                this.fillCharts.call(this, {
                    period: "interval",
                    dateFrom: `${currentYear - 1}-12-${currentDay}`,
                    dateTo: `${currentYear}-01-${currentDay}`
                }).then();

            } else {
                this.fillCharts.call(this, {
                    period: "interval",
                    dateFrom: `${currentYear}-${currentMonth - 1}-${daysInPrevMonth - (daysInCurrentMonth - currentDay - 1)}`,
                    dateTo: `${currentYear}-${currentMonth}-${currentDay}`
                }).then();
            }
        });

        this.yearTimeBtn.addEventListener('click', (e) => {
            this.removeIntervalStyles();
            e.target.classList.add('active');
            this.fillCharts.call(this, {
                period: "interval",
                dateFrom: `${(new Date()).getFullYear() - 1}-${(new Date()).getMonth() + 1}-${(new Date()).getUTCDate() + 1}`,
                dateTo: `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getUTCDate()}`
            }).then();
        });

        this.allTimeBtn.addEventListener('click', (e) => {
            this.removeIntervalStyles();
            e.target.classList.add('active');
            this.fillCharts.call(this, {
                period: "interval",
                dateFrom: "1000-01-01",
                dateTo: `3000-01-01`
            }).then();
        });

        this.intervalTimeBtn.addEventListener('click', (e) => {
            this.setIntervalStyles();
            e.target.classList.add('active');
        });

        this.intervalPrevCalendar.addEventListener('change', () => {
            if (this.intervalNextCalendar.value && this.intervalPrevCalendar.value) {
                this.fillCharts.call(this, {
                    period: "interval",
                    dateFrom: this.intervalPrevCalendar.value,
                    dateTo: this.intervalNextCalendar.value
                }).then();
            }
        });

        this.intervalNextCalendar.addEventListener('change', () => {
            if (this.intervalNextCalendar.value && this.intervalPrevCalendar.value) {
                this.fillCharts.call(this, {
                    period: "interval",
                    dateFrom: this.intervalPrevCalendar.value,
                    dateTo: this.intervalNextCalendar.value
                }).then();
            }
        });
    }

    async fillCharts(data) {
        const operations = await this.getOperations(data);

        if (operations && operations.length > 0) {
            if (this.incomeChart && this.expenseChart) {
                this.incomeChart.destroy();
                this.expenseChart.destroy();
            }
            const expenseOperations = this.getAggregateOperations(operations, 'expense');
            const incomeOperations = this.getAggregateOperations(operations, 'income');

            this.expenseChart = {
                type: 'pie',
                data: {
                    labels: expenseOperations.map(operation => operation.category),
                    datasets: [{
                        data: expenseOperations.map(operation => operation.amount),
                        borderWidth: 1
                    }]
                },
                padding: '40px'
            };
            this.incomeChart = {
                type: 'pie',
                data: {
                    labels: incomeOperations.map(operation => operation.category),
                    datasets: [{
                        data: incomeOperations.map(operation => operation.amount),
                        borderWidth: 1
                    }]
                },
                padding: '40px'
            };

            this.incomeChart = new Chart(document.getElementById('pie-chart-incomes'), this.incomeChart);
            this.expenseChart = new Chart(document.getElementById('pie-chart-expenses'), this.expenseChart);
        } else if ((!operations || operations.length === 0)
            && this.incomeChart && this.expenseChart) {
            this.incomeChart.destroy();
            this.expenseChart.destroy();
        }
    }

    getAggregateOperations(operations, type) {
        let resultOperations = [];

        operations
            .filter(operation => operation.type === type)
            .map(operation => {
                const modifiedOperation = {
                    amount: operation.amount
                };
                modifiedOperation.category = operation.category ? operation.category : 'Другое';
                return modifiedOperation;
            }).forEach(operation => {
            if (resultOperations.length === 0 || !resultOperations.some(item => item.category === operation.category)) {
                resultOperations.push(operation);
            } else {
                resultOperations.find(item => item.category === operation.category).amount += operation.amount;
            }
        });

        return resultOperations;
    }

    async getOperations(queryParams) {
        let url = '/operations';
        if (queryParams) {
            url += '?';
            for (let key in queryParams) {
                key === Object.keys(queryParams)[Object.keys(queryParams).length - 1] ?
                    url += `${key}=${queryParams[key]}` : url += `${key}=${queryParams[key]}&`;
            }
        }

        const result = await HttpUtils.request(url);

        if (result.error) {
            console.log(result.response.message);
            if (result.redirect) {
                return result.redirect ? this.openNewRoute(result.redirect) : null;
            }
        }

        return result.response;
    }

    removeIntervalStyles() {
        for (let i = 0; i < this.timeBtns.length; i++)
            this.timeBtns[i].classList.remove('active');

        this.intervalPrevSpan.style.display = 'inline';
        this.intervalNextSpan.style.display = 'inline';

        this.intervalPrevCalendar.style.display = 'none';
        this.intervalNextCalendar.style.display = 'none';
    }

    setIntervalStyles() {
        for (let i = 0; i < this.timeBtns.length; i++)
            this.timeBtns[i].classList.remove('active');

        this.intervalPrevSpan.style.display = 'none';
        this.intervalNextSpan.style.display = 'none';

        this.intervalPrevCalendar.style.display = 'inline';
        this.intervalNextCalendar.style.display = 'inline';
    }
}
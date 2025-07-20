import {ClickUtils} from "../utils/click-utils";
import {DateValidateUtils} from "../utils/date-validate-utils";
import {HttpUtils} from "../utils/http-utils";
import {OperationTableSearchType} from "../types/operation-table-item.type";
import {OperationResponseType} from "../types/operation-response.type";
import {ResultResponseType} from "../types/result-response.type";
import {
    Chart,
    Colors,
    BarController,
    CategoryScale,
    LinearScale,
    BarElement,
    Legend,
    PieController,
    ArcElement
} from 'chart.js'

Chart.register(
    Colors,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Legend,
    PieController,
    ArcElement
);
import {CustomChartType} from "../types/custom-chart.type";

export class MainPage {
    private readonly openNewRoute: Function;
    private readonly timeBtns: HTMLCollectionOf<HTMLButtonElement> = <HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName('time-btn');
    private readonly intervalPrevCalendar: HTMLInputElement = <HTMLInputElement>document.getElementById('interval-prev-time-btn');
    private readonly intervalNextCalendar: HTMLInputElement = <HTMLInputElement>document.getElementById('interval-next-time-btn');
    private readonly intervalPrevSpan: HTMLSpanElement = <HTMLSpanElement>document.getElementById('interval-prev-time-span');
    private readonly intervalNextSpan: HTMLSpanElement = <HTMLSpanElement>document.getElementById('interval-next-time-span');

    private readonly todayTimeBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById('today-time-btn');
    private readonly weekTimeBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById('week-time-btn');
    private readonly monthTimeBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById('month-time-btn');
    private readonly yearTimeBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById('year-time-btn');
    private readonly allTimeBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById('all-time-btn');
    private readonly intervalTimeBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById('interval-time-btn');

    private incomeChart: Chart | null = null;
    private expenseChart: Chart | null = null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        ClickUtils.addEvents(window.location.pathname);
        this.setAllEvents();
        this.allTimeBtn.click();
    }

    private setAllEvents(): void {
        this.todayTimeBtn.addEventListener('click', (e: Event) => {
            this.removeIntervalStyles();
            (e.target as HTMLElement).classList.add('active');
            const currentDate: string = `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getUTCDate()}`;
            this.fillCharts.call(this, {
                period: "interval",
                dateFrom: currentDate,
                dateTo: currentDate
            }).then();
        });

        this.weekTimeBtn.addEventListener('click', (e) => {
            this.removeIntervalStyles();
            (e.target as HTMLElement).classList.add('active');
            const currentYear: number = (new Date()).getFullYear();
            const currentMonth: number = (new Date()).getMonth() + 1;
            const currentDay: number = (new Date()).getUTCDate();

            if (currentDay < 7) {
                if (currentMonth === 1) {
                    this.fillCharts.call(this, {
                        period: "interval",
                        dateFrom: `${currentYear - 1}-01-${31 - (6 - currentDay)}`,
                        dateTo: `${currentYear}-${currentMonth}-${currentDay}`
                    }).then();
                } else {
                    const daysInPrevMonth: number = DateValidateUtils.getNumberDaysFromCurrentMonth(currentYear, currentMonth - 1);
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
            (e.target as HTMLElement).classList.add('active');
            const currentYear: number = (new Date()).getFullYear();
            const currentMonth: number = (new Date()).getMonth() + 1;
            const currentDay: number = (new Date()).getUTCDate();

            const daysInPrevMonth: number = DateValidateUtils.getNumberDaysFromCurrentMonth(currentYear, currentMonth - 1);
            const daysInCurrentMonth: number = DateValidateUtils.getNumberDaysFromCurrentMonth(currentYear, currentMonth);

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
            (e.target as HTMLElement).classList.add('active');
            this.fillCharts.call(this, {
                period: "interval",
                dateFrom: `${(new Date()).getFullYear() - 1}-${(new Date()).getMonth() + 1}-${(new Date()).getUTCDate() + 1}`,
                dateTo: `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getUTCDate()}`
            }).then();
        });

        this.allTimeBtn.addEventListener('click', (e) => {
            this.removeIntervalStyles();
            (e.target as HTMLElement).classList.add('active');
            this.fillCharts.call(this, {
                period: "interval",
                dateFrom: "1000-01-01",
                dateTo: `3000-01-01`
            }).then();
        });

        this.intervalTimeBtn.addEventListener('click', (e) => {
            this.setIntervalStyles();
            (e.target as HTMLElement).classList.add('active');
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

    private async fillCharts(data: OperationTableSearchType): Promise<void> {
        const operations: OperationResponseType[] | null = await this.getOperations(data);

        if (operations && operations.length > 0) {
            if (this.incomeChart && this.expenseChart) {
                this.incomeChart.destroy();
                this.expenseChart.destroy();
            }
            const expenseOperations = this.getAggregateOperations(operations, 'expense');
            const incomeOperations = this.getAggregateOperations(operations, 'income');

            const expenseChartConfig: any = {
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
            const incomeChartConfig: any = {
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

            this.incomeChart = new Chart(<HTMLCanvasElement>document.getElementById('pie-chart-incomes'), incomeChartConfig);
            this.expenseChart = new Chart(<HTMLCanvasElement>document.getElementById('pie-chart-expenses'), expenseChartConfig);
        } else if ((!operations || operations.length === 0)
            && this.incomeChart && this.expenseChart) {
            this.incomeChart.destroy();
            this.expenseChart.destroy();
        }
    }

    getAggregateOperations(operations: OperationResponseType[], type: string) {
        let resultOperations: { amount: number, category: string }[] = [];

        operations
            .filter(operation => operation.type === type)
            .map(operation => {
                const modifiedOperation = {
                    amount: operation.amount,
                    category: ''
                };
                modifiedOperation.category = operation.category ? operation.category : 'Другое';
                return modifiedOperation;
            }).forEach(operation => {
            if (resultOperations.length === 0 || !resultOperations.some(item => item.category === operation.category)) {
                resultOperations.push(operation);
            } else {
                (resultOperations.find(item => item.category === operation.category) as { amount: number, category: string }).amount += operation.amount;
            }
        });

        return resultOperations;
    }

    async getOperations(queryParams: { [key: string]: string }): Promise<OperationResponseType[] | null> {
        let url: string = '/operations';
        if (queryParams) {
            url += '?';
            let key: string;
            for (key in queryParams) {
                key === Object.keys(queryParams)[Object.keys(queryParams).length - 1] ?
                    url += `${key}=${queryParams[key]}` : url += `${key}=${queryParams[key]}&`;
            }
        }

        const result: ResultResponseType = await HttpUtils.request(url);

        if (result.error) {
            console.log(result.response? result.response.message: 'неизвестная ошибка');
            if (result.redirect) {
                this.openNewRoute(result.redirect);
                return null;
            }
        }

        return result.response as OperationResponseType[];
    }

    private removeIntervalStyles(): void {
        for (let i: number = 0; i < this.timeBtns.length; i++)
            this.timeBtns[i].classList.remove('active');

        this.intervalPrevSpan.style.display = 'inline';
        this.intervalNextSpan.style.display = 'inline';

        this.intervalPrevCalendar.style.display = 'none';
        this.intervalNextCalendar.style.display = 'none';
    }

    private setIntervalStyles(): void {
        for (let i = 0; i < this.timeBtns.length; i++)
            this.timeBtns[i].classList.remove('active');

        this.intervalPrevSpan.style.display = 'none';
        this.intervalNextSpan.style.display = 'none';

        this.intervalPrevCalendar.style.display = 'inline';
        this.intervalNextCalendar.style.display = 'inline';
    }
}
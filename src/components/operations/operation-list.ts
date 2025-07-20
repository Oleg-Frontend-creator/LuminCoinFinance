import {ClickUtils} from "../../utils/click-utils";
import {HttpUtils} from "../../utils/http-utils";
import {DateValidateUtils} from "../../utils/date-validate-utils";
import {OperationTableSearchType} from "../../types/operation-table-item.type";
import {ResultResponseType} from "../../types/result-response.type";
import {OperationResponseType} from "../../types/operation-response.type";

export class OperationList {
    private readonly openNewRoute: Function;

    private readonly deleteOperationButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('delete-operation-btn');
    private readonly modalElement: HTMLElement = <HTMLElement>document.getElementById('modal-operation');
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

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        ClickUtils.addEvents(window.location.pathname);
        this.setAllEvents();
        // выгрузка в таблицу всех операций
        this.allTimeBtn.click();
    }

    private setAllEvents(): void {
        this.todayTimeBtn.addEventListener('click', (e: Event | null) => {
            this.removeIntervalStyles();
            if (e) {
                (e.target as HTMLButtonElement).classList.add('active');
                const currentDate: string = `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getUTCDate()}`;
                this.fillOperationTable.call(this, {
                    period: "interval",
                    dateFrom: currentDate,
                    dateTo: currentDate
                }).then();
            }
        });

        this.weekTimeBtn.addEventListener('click', (e: Event | null) => {
            this.removeIntervalStyles();
            if (e) {
                (e.target as HTMLButtonElement).classList.add('active');
                const currentYear: number = (new Date()).getFullYear();
                const currentMonth: number = (new Date()).getMonth() + 1;
                const currentDay: number = (new Date()).getUTCDate();

                if (currentDay < 7) {
                    if (currentMonth === 1) {
                        this.fillOperationTable.call(this, {
                            period: "interval",
                            dateFrom: `${currentYear - 1}-01-${31 - (6 - currentDay)}`,
                            dateTo: `${currentYear}-${currentMonth}-${currentDay}`
                        }).then();
                    } else {
                        const daysInPrevMonth: number = DateValidateUtils.getNumberDaysFromCurrentMonth(currentYear, currentMonth - 1);
                        this.fillOperationTable.call(this, {
                            period: "interval",
                            dateFrom: `${currentYear}-${currentMonth - 1}-${daysInPrevMonth - (6 - currentDay)}`,
                            dateTo: `${currentYear}-${currentMonth}-${currentDay}`
                        }).then();
                    }
                } else {
                    this.fillOperationTable.call(this, {
                        period: "interval",
                        dateFrom: `${currentYear}-${currentMonth}-${currentDay - 6}`,
                        dateTo: `${currentYear}-${currentMonth}-${currentDay}`
                    }).then();
                }
            }
        });

        this.monthTimeBtn.addEventListener('click', (e: Event | null) => {
            this.removeIntervalStyles();
            if (e) {
                (e.target as HTMLButtonElement).classList.add('active');
                const currentYear: number = (new Date()).getFullYear();
                const currentMonth: number = (new Date()).getMonth() + 1;
                const currentDay: number = (new Date()).getUTCDate();

                const daysInPrevMonth: number = DateValidateUtils.getNumberDaysFromCurrentMonth(currentYear, currentMonth - 1);
                const daysInCurrentMonth: number = DateValidateUtils.getNumberDaysFromCurrentMonth(currentYear, currentMonth);

                if (daysInPrevMonth === currentDay) {
                    return this.fillOperationTable.call(this, {
                        period: "interval",
                        dateFrom: `${currentYear}-${currentMonth}-01`,
                        dateTo: `${currentYear}-${currentMonth}-${daysInCurrentMonth}`
                    }).then();
                }

                if (currentMonth === 1) {
                    this.fillOperationTable.call(this, {
                        period: "interval",
                        dateFrom: `${currentYear - 1}-12-${currentDay}`,
                        dateTo: `${currentYear}-01-${currentDay}`
                    }).then();

                } else {
                    this.fillOperationTable.call(this, {
                        period: "interval",
                        dateFrom: `${currentYear}-${currentMonth - 1}-${daysInPrevMonth - (daysInCurrentMonth - currentDay - 1)}`,
                        dateTo: `${currentYear}-${currentMonth}-${currentDay}`
                    }).then();
                }
            }
        });

        this.yearTimeBtn.addEventListener('click', (e: Event | null) => {
            this.removeIntervalStyles();
            if (e) {
                (e.target as HTMLButtonElement).classList.add('active');
                this.fillOperationTable.call(this, {
                    period: "interval",
                    dateFrom: `${(new Date()).getFullYear() - 1}-${(new Date()).getMonth() + 1}-${(new Date()).getUTCDate() + 1}`,
                    dateTo: `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getUTCDate()}`
                }).then();
            }
        });

        this.allTimeBtn.addEventListener('click', (e: Event | null) => {
            this.removeIntervalStyles();
            if (e) {
                (e.target as HTMLButtonElement).classList.add('active');
                this.fillOperationTable.call(this, {
                    period: "interval",
                    dateFrom: "1000-01-01",
                    dateTo: `3000-01-01`
                }).then();
            }
        });

        this.intervalTimeBtn.addEventListener('click', (e: Event | null) => {
            this.setIntervalStyles();
            if (e) {
                (e.target as HTMLButtonElement).classList.add('active');
            }
        });

        this.intervalPrevCalendar.addEventListener('change', () => {
            if (this.intervalNextCalendar.value && this.intervalPrevCalendar.value) {
                this.fillOperationTable.call(this, {
                    period: "interval",
                    dateFrom: this.intervalPrevCalendar.value,
                    dateTo: this.intervalNextCalendar.value
                }).then();
            }
        });

        this.intervalNextCalendar.addEventListener('change', () => {
            if (this.intervalNextCalendar.value && this.intervalPrevCalendar.value) {
                this.fillOperationTable.call(this, {
                    period: "interval",
                    dateFrom: this.intervalPrevCalendar.value,
                    dateTo: this.intervalNextCalendar.value
                }).then();
            }
        });

        this.deleteOperationButton.addEventListener('click', this.deleteOperation.bind(this));
    }

    async fillOperationTable(data: OperationTableSearchType) {
        const operations: OperationResponseType[] | null = await this.getOperations(data);
        const operationsListElement: HTMLElement | null = document.getElementById('operations-list');
        if (operationsListElement)
            operationsListElement.innerHTML = '';

        if (operationsListElement && operations && operations.length > 0) {
            for (let i: number = 0; i < operations.length; i++) {
                const trElement: HTMLTableRowElement = document.createElement('tr');
                trElement.setAttribute('id', 'tr-' + operations[i].id);

                const numberCell: HTMLTableCellElement = trElement.insertCell();
                numberCell.innerText = (i + 1).toString();
                numberCell.className = 'text-center fw-bold';

                const typeCell: HTMLTableCellElement = trElement.insertCell();
                typeCell.className = 'text-center';
                if (operations[i].type === "expense") {
                    typeCell.innerHTML = '<span class="text-danger">расход</span>';
                } else if (operations[i].type === "income") {
                    typeCell.innerHTML = '<span class="text-success">доход</span>';
                } else {
                    typeCell.innerHTML = '<span class="text-secondary">неизвестно</span>';
                }

                const categoryTypeCell: HTMLTableCellElement = trElement.insertCell();
                categoryTypeCell.className = 'text-center';
                categoryTypeCell.innerText = operations[i].category ? <string>operations[i].category : '';

                const amountCell: HTMLTableCellElement = trElement.insertCell();
                amountCell.className = 'text-center';
                amountCell.innerText = operations[i].amount ? `${operations[i].amount}$` : '';

                const dateCell: HTMLTableCellElement = trElement.insertCell();
                dateCell.className = 'text-center';
                dateCell.innerText = operations[i].date ? operations[i].date.split("-").reverse().join(".") : '';

                const commentCell: HTMLTableCellElement = trElement.insertCell();
                commentCell.className = 'text-center px-1';
                commentCell.innerText = operations[i].comment ? operations[i].comment : '';

                const linksCell: HTMLTableCellElement = trElement.insertCell();
                linksCell.className = 'text-center d-flex align-items-center border-0';
                linksCell.innerHTML = '<svg class="me-0 me-sm-2 delete-button operation-icon" width="14" id="' + operations[i].id + '" \n' +
                    '                     height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                    '                    <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z"\n' +
                    '                          fill="black"/>\n' +
                    '                    <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z"\n' +
                    '                          fill="black"/>\n' +
                    '                    <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z"\n' +
                    '                          fill="black"/>\n' +
                    '                    <path fill-rule="evenodd" clip-rule="evenodd"\n' +
                    '                          d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z"\n' +
                    '                          fill="black"/>\n' +
                    '                </svg>\n' +
                    '                ';

                const editLinkElement: HTMLAnchorElement = document.createElement('a');
                editLinkElement.setAttribute('href', '/operations/edit?id=' + operations[i].id);
                editLinkElement.innerHTML = '<svg class="operation-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"\n' +
                    '                         xmlns="http://www.w3.org/2000/svg">\n' +
                    '                        <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z"\n' +
                    '                              fill="black"/>\n' +
                    '                    </svg>';
                linksCell.appendChild(editLinkElement);

                operationsListElement.appendChild(trElement);
            }
        }

        const deleteButtons: HTMLCollectionOf<HTMLElement> =
            <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('delete-button');
        for (let i: number = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', this.setOperationId.bind(this));
        }
    }

    private setOperationId(e: Event | null): void {
        if (e && e.target) {
            this.modalElement.style.display = 'block';

            const targetElement: HTMLElement | null = <HTMLElement | null>e.target;
            const targetParentElement: HTMLElement | null | undefined = targetElement?.parentElement;
            if (targetParentElement && targetParentElement.tagName === 'svg' && targetParentElement.getAttribute('id')) {
                this.modalElement.setAttribute('data-operation-id', targetParentElement.getAttribute('id') as string);
            } else if (targetParentElement && targetParentElement.tagName !== 'svg' && targetElement?.getAttribute('id')) {
                this.modalElement.setAttribute('data-operation-id', targetElement.getAttribute('id') as string);
            }
        }
    }

    private async deleteOperation(): Promise<void> {
        const id: string | null = this.modalElement.getAttribute('data-operation-id');
        let result: ResultResponseType;
        if (id) {
            result = await HttpUtils.request('/operations/' + id, 'DELETE', true);

            if (result && result.error) {
                this.modalElement.style.display = 'none';
                return console.log("Не удалось удалить операцию, обратитесь к администратору");
            }
            document.getElementById('tr-' + id)?.remove();
        }
        this.modalElement.style.display = 'none';
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
            console.log(result.response.message);
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
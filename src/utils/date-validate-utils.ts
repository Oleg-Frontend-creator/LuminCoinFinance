export class DateValidateUtils {
    //возвращает количество дней в текущем месяце в зависимости от года и месяца
    public static getNumberDaysFromCurrentMonth(year: number, month: number): number {
        let currentDate: number = 0;
        if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) !== -1) {
            currentDate = 31;
        } else if ([4, 6, 9, 11].indexOf(month) !== -1) {
            currentDate = 30;
        } else if ([2].indexOf(month) !== -1) {
            currentDate = (year % 4 === 0) ? 29 : 28;
        }

        return currentDate;
    }
}
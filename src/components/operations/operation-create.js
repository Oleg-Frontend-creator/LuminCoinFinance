export class OperationCreate{
    constructor() {
        //бургерное меню на адаптив

        document.getElementById('burger').onclick = function () {
            document.getElementById('menu').classList.add('open');
        }
        document.getElementById('close').addEventListener("click", () => {
            document.getElementById('menu').classList.remove('open');
        });
    }
}
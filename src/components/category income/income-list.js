import {ClickUtils} from "../../utils/click-utils";

export class IncomeList {
    constructor() {
        ClickUtils.addEvents(window.location.pathname);
    }
}
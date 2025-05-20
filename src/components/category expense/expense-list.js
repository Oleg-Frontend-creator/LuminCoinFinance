import {ClickUtils} from "../../utils/click-utils";

export class ExpenseList {
    constructor() {
        ClickUtils.addEvents(window.location.pathname);
    }
}
import {ClickUtils} from "../../utils/click-utils";

export class ExpenseEdit {
    constructor() {
        ClickUtils.addEvents(window.location.pathname);
    }
}
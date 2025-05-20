import {ClickUtils} from "../../utils/click-utils";

export class ExpenseCreate {
    constructor() {
        ClickUtils.addEvents(window.location.pathname);
    }
}
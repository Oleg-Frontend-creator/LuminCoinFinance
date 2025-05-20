import {ClickUtils} from "../../utils/click-utils";

export class OperationCreate{
    constructor() {
        ClickUtils.addEvents(window.location.pathname);
    }
}
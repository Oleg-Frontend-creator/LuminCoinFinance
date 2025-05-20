import {ClickUtils} from "../../utils/click-utils";

export class OperationList {
    constructor() {
        ClickUtils.addEvents(window.location.pathname);
    }
}
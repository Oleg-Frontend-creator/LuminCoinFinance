import {ClickUtils} from "../../utils/click-utils";

export class OperationEdit{
    constructor() {
        ClickUtils.addEvents(window.location.pathname);
    }
}
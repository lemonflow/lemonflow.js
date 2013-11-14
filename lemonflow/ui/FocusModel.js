var FocusModel = (function () {
    function FocusModel() {
        this.availableViews = [];
        this.focusComponentStack = [];
    }
    //        private static _instance:FocusModel = null;
    //    constructor() { FocusModel._instance = this; }
    //    public static function getInstance():FocusModel {
    //        return (FocusModel._instance===null?:(FocusModel._instance = new FocusModel()):FocusModel._instance;)
    //    }
    FocusModel.prototype.transferFocus = function (oldactiveC, newactiveC) {
        this.deactivate(oldactiveC);
        FocusModel.instance.focusComponentStack.push(newactiveC);
        this.activate(newactiveC);
    };
    FocusModel.prototype.setFocus = function (newactiveC) {
        this.deactivate(FocusModel.instance.focusComponentStack[FocusModel.instance.focusComponentStack.length - 1]);
        FocusModel.instance.focusComponentStack.push(newactiveC);
        this.activate(newactiveC);
    };

    FocusModel.prototype.deactivateFocus = function (oldactiveC) {
        this.deactivate(oldactiveC);
        FocusModel.instance.focusComponentStack.pop();
        var newactiveC;
        newactiveC = this.focusComponentStack.length > 0 ? this.focusComponentStack[this.focusComponentStack.length - 1] : null;
        this.activate(newactiveC);
    };

    FocusModel.prototype.activateFocus = function (newactiveC) {
        var oldactiveC;
        oldactiveC = this.focusComponentStack.length > 0 ? this.focusComponentStack[this.focusComponentStack.length - 1] : null;
        this.deactivate(oldactiveC);
        FocusModel.instance.focusComponentStack.push(newactiveC);
        this.activate(newactiveC);
    };

    //component gains focus, i.e. all input events get routed to this component
    FocusModel.prototype.activate = function (c) {
        if (c == null)
            return;
        for (var i = 0; i < c.eventTypes.length; i++)
            InputManager.getInstance().addEventListener(c.eventTypes[i], c.processUserInput);

        c.inFocus = true;
        c.processUserInput(new UIStateEvent(UIStateEvent.FOCUS_ACTIVATE));
    };

    //component looses focus
    FocusModel.prototype.deactivate = function (c) {
        if (c == null)
            return;

        for (var i = 0; i < c.eventTypes.length; i++)
            InputManager.getInstance().removeEventListener(c.eventTypes[i], c.processUserInput);

        c.inFocus = false;
        c.processUserInput(new UIStateEvent(UIStateEvent.FOCUS_DEACTIVATE));
    };
    FocusModel.instance = new FocusModel();
    return FocusModel;
})();

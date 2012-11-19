UIContext.prototype = Object.create(BaseContext.prototype);

function UIContext() {
    BaseContext.apply(this, arguments);

    this.state                 = "main";
    this.view                  = null;
    this.controller            = null;
}

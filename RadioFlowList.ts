Qt.include("OperatorRadioLayout.js")
Qt.include("OperatorRadioLayoutReorder.js")
Qt.include("OperatorRadioSubs.js")

RadioFlowList.prototype = Object.create(UIGroupSprite.prototype);

function RadioFlowList() {
    UIGroupSprite.apply(this, arguments);

    this._coverCurrentCount  =5;
    this._coverTargetCount   =5;

    //this.itemRenderer = new ClassFactory(com.daimler.components.ntg5.coverflowradio.CoverRadioItem);
    //this.dataProvider = ModelBase.instance.getIncompleteModel("homescreen", 10, 1);
    this.transitionDuration = 733;
    this.transitionEasing   = "easeOutQuad";
    this.reuseDataRenders   = false;
    this.numberOfSlots      = 9;
    this.initSelectedIndex  = 1;
    this.radiusXYZ          = {x:164, y:0, z:300}
    this.centerXYZ          = {x:960/2-125, y:135, z:1}
    this.dataRendererUpdateSpread = 2;

    this.operators.push(new OperatorRadioLayout(this));
    this.operators.push(new OperatorRadioSubs(this));
}



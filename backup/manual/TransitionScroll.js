TransitionScroll.prototype = Object.create(BaseTransition.prototype);

function TransitionScroll(s) {
    BaseTransition.apply(this, arguments);

    this.run = function(e) {
        s.controller.radioFlowList.operators[0].active = true;
        s.controller.radioFlowList.scrollRelative(1,0.3);
    }
}

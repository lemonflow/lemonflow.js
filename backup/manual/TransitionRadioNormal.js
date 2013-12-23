TransitionRadioNormal.prototype = Object.create(BaseTransition.prototype);

function TransitionRadioNormal(s) {
    BaseTransition.apply(this, arguments);

    this.run = function(e) {
        s.controller.radioFlowList.operators[0].active = false;
        Tweener.addTween(s.controller.radioFlowList.slots[5], {y:135, time:1, delay:0.0, transition:"easeOutExpo"});
        for(var i=0;i<5;i++) {
            if(i==2) continue;
            Tweener.addTween(s.controller.radioFlowList.slots[3+i], {opacity:1, time:1, delay:0.0, transition:"easeOutExpo"});
        }
    }
}

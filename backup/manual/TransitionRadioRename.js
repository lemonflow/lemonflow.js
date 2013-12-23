TransitionRadioRename.prototype = Object.create(BaseTransition.prototype);

function TransitionRadioRename(s) {
    BaseTransition.apply(this, arguments);

    this.run = function(e) {
        s.controller.radioFlowList.scrollAbsolute(5,0.3);
        Tweener.addTween(s.controller.radioFlowList.slots[5], {y:90, time:1, delay:0.8, transition:"easeOutExpo"});
        for(var i=0;i<5;i++) {
            if(i==2) continue;
            Tweener.addTween(s.controller.radioFlowList.slots[3+i], {opacity:0, time:1, delay:0.8, transition:"easeOutExpo"});
        }
    }
}

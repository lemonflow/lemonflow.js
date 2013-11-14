function InteractionState() {
    this.view = null;

    this.selectedIndex 				= 0;
    this.oldSelectedIndex			= 0;
    this.initSelectedIndex		= 0;
    this.currentIndex               = 0;
    this.direction                  = 0;

    this.selectedState 				= 0;
    this.oldSelectedState			= 0;
    this.initState				= 0;
    this.currentState               = 0;

    this.currentIndex = this.selectedIndex = this.oldSelectedIndex = this.initSelectedIndex;


    this.scrollRelative = function(step, duration) {
        if(this.selectedIndex+step<0) return false;
        this.oldSelectedIndex = this.selectedIndex;
        this.selectedIndex+=step;
        this.transitionToIndex(duration);
        return true;
    }

    this.scrollAbsolute = function(target, duration) {
        if(target<0) return false;
        this.oldSelectedIndex = this.selectedIndex;
        this.selectedIndex=target;
        this.transitionToIndex(this.duration);
        return true;
    }

    this.transitionToIndex=function(duration) {
        if(this.currentIndex != this.selectedIndex) {
            this.direction = this.selectedIndex -this.oldSelectedIndex;
            Lemonflow.view = this.view;
            Tweener.timerObj.triggered.connect(this.invalidate);
            Tweener.addTween(this, { currentIndex: this.selectedIndex, time: duration!=undefined?duration:(this.view.transitionDuration/1000), transition: this.view.transitionEasing});
        }
    }

    this.invalidate  = function() { Lemonflow.view.invalidate(); }
    this.setComponent = function(c) { this.view = c; }
    this.setSelectedIndex = function(s) { this.scrollAbsolute(s); }
}

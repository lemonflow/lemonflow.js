function OperatorInteraction(v) {
    this.group = v;
    this.active= true;
    this.doTween= false;
    this.sortByZ= false;
    this.tween= false;

    this.setup = function(slots) {}
    this.update = function(slots, currentIdx, nextIndex) {}
    this.processUserInput = function(e) {};
}

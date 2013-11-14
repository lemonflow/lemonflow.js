function BaseTransition (s) {
    this.operatorUpdateFunction = null;
    this.operatorCompleteFunction = null;
    this.scheduler = s;

    this.run = function(e) {}
}

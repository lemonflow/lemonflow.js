/// <reference path="../../lemonflow.ts" />

class BaseTransition {
        operatorUpdateFunction = function():void {}
		operatorCompleteFunction = function():void {}
		scheduler:BaseScheduler;
    
		constructor(s:BaseScheduler) {
			this.scheduler = s;
		}
    
		run(e:Event=null):void {}
	}

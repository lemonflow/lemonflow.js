class FocusModel {
		static instance:FocusModel = new FocusModel();
		availableViews = [];
		focusComponentStack = [];
        focusView = null;
        syncConnection = null;  //syncs focus to external focusmodel
    
		transferFocus(oldactiveC:OperatorStates, newactiveC:OperatorStates):void {
			this.deactivate(oldactiveC);
			this.focusComponentStack.push(newactiveC);
			this.activate(newactiveC);
		}
    
		setFocus(newactiveC:OperatorStates):void {
			this.deactivate(this.focusComponentStack[this.focusComponentStack.length-1]);
			this.focusComponentStack.push(newactiveC);
			this.activate(newactiveC);
		}
		
		deactivateFocus(oldactiveC:OperatorStates):void {
			this.deactivate(oldactiveC);
			this.focusComponentStack.pop();
			var newactiveC:OperatorStates;
			newactiveC = this.focusComponentStack.length>0?this.focusComponentStack[this.focusComponentStack.length-1]:null;
			this.activate(newactiveC);
		}
		
		activateFocus(newactiveC:OperatorStates):void {
			var oldactiveC:OperatorStates;
			oldactiveC = this.focusComponentStack.length>0?this.focusComponentStack[this.focusComponentStack.length-1]:null;
			this.deactivate(oldactiveC);
			this.focusComponentStack.push(newactiveC);
			this.activate(newactiveC);
		}
		
		//component gains focus, i.e. all input events get routed to this component
		activate(c:OperatorStates):void {
			if(c == null) return;
			for(var i:number=0;i<c.eventTypes.length;i++) 
				InputManager.getInstance().addEventListener(c.eventTypes[i], c.processUserInput);
            
            this.focusView = c;
			c.inFocus = true;
			c.processUserInput(new UIStateEvent(UIStateEvent.FOCUS_ACTIVATE));
		}
		
		//component looses focus
		deactivate(c:OperatorStates):void {
			if(c == null) return;
			
			for(var i=0;i<c.eventTypes.length;i++) 
				InputManager.getInstance().removeEventListener(c.eventTypes[i], c.processUserInput);
			
			c.inFocus = false;
			c.processUserInput(new UIStateEvent(UIStateEvent.FOCUS_DEACTIVATE));
		}
	}

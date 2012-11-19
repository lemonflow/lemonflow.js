package com.daimler.components.ntg5.coverflowradio
{
	import lemonflow.ui.base.OperatorInteraction;
	import lemonflow.ui.base.VisualItem;

	public class OperatorCursorVPosition extends OperatorInteraction {
		protected var component:RadioFlowList = null;
		
		protected var lastCurrentIndex:Number = 0;
		protected var deltaIndex:Number = 0;			//index changes per frame
		
		public function OperatorCursorVPosition(v:RadioFlowList):void {
			component = v;
		}

		override public function update(slots:Vector.<VisualItem> = null, currentIdx:Number = 0, nextIndex:Number = 0):void {
			//store the delta
			deltaIndex = component.currentIndex- lastCurrentIndex;
			lastCurrentIndex = component.currentIndex;
			
			//adjust the cursor
			component.cursorScrollOffsetY = Math.max(0, Math.min(component.lastPos-component.firstPos, component.cursorScrollOffsetY + component.deltaPos * deltaIndex));
			component.highlight.y = component.cursorScrollOffsetY + component.firstPos;
			component.cursorScrollIndex = component.cursorScrollOffsetY/component.deltaPos;
			
			//adjust the scroll bar
			component.listScrollIndicator.y = component.currentIndex*((540-component.listScrollIndicator.height)/(component.dataProvider.length-1));
			
		}
	}
}
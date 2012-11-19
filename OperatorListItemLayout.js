package com.daimler.compositions.ntg5home.components.verticallist
{
	import lemonflow.ui.base.OperatorInteraction;
	import lemonflow.ui.base.VisualItem;
	
	public class OperatorListItemLayout extends OperatorInteraction {
		protected var lastScrollY:Number = 0;
		protected var lastCurrentIndex:Number = 0;
		protected var lastCursorPos:int = 0;
		protected var lastIndex:int = 0;
		protected var cursorIndex:int = 0;
		
		private var slot:VisualItem;
		
		protected var component:ListView = null;
		
		private var floatingIdx:Number = 0;
		
		public function OperatorListItemLayout(v:ListView):void { component = v; }
		
		override public function update(slots:Vector.<VisualItem> = null, currentIdx:Number = 0, nextIndex:Number = 0):void {
			var deltaIndex:Number = component.currentIndex- lastCurrentIndex;
			lastCurrentIndex = component.currentIndex;
			
			//calculate the content delta
			lastScrollY = Math.max(0, lastScrollY+ component.deltaPos * deltaIndex);
			component.contentScrollOffsetY = lastScrollY - component.cursorScrollOffsetY;
			
			var firstVisibleEntry:int = component.contentScrollOffsetY/component.deltaPos;
			for(var i:int = 0;i<component.numberOfSlots;i++) {
				floatingIdx = i-group.currentIndex;
				
				slot = component.getDataRenderer(firstVisibleEntry+i);
				slot.x = 0 	  	 			 	+ i*0;
				slot.y = component.firstPos 	+ i*(component.deltaPos+component.listOpeness) - component.contentScrollOffsetY + firstVisibleEntry*component.deltaPos;
				slot.z = 0;
				
				slot.alpha = 1//(slot.y<=(component.lastPos+component.deltaPos/3) && slot.y>=(component.firstPos - component.deltaPos/3))?1:0;
				slot.visible = true;//(slot.y<=(component.lastPos+component.deltaPos/2) && slot.y>=(component.firstPos -component.deltaPos/2));
				
//				(slot.render as ListItemRenderer).listitem.alpha = (1-Math.min(1,Math.abs(floatingIdx)))/3+0.666;
				(slot.render as ListItemRenderer).listitem.alpha = 1;
			}
			
			
		}
	}
}
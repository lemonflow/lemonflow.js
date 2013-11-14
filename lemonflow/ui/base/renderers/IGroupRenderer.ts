package lemonflow.ui.base.renderers {
	
	import lemonflow.ui.base.VisualItem;
	
	import flash.display.Bitmap;
	
	public interface IGroupRenderer {
		function newChild(bitmapRef, properties:VisualItem):void;
		function updateDisplayList():void;
//		function invalidateDisplayList():void;
	}
}

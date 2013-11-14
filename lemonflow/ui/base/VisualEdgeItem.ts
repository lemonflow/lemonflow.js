package lemonflow.ui.base
{
	import flare.display.itemrenderer.EdgeRenderer;
	
	import flash.geom.Point;
	
	/**
	 * contains visual data used to represent a connection between two data elements.
	 */
	
	public class VisualEdgeItem extends VisualDataItem
	{		
		public var x1:Number;
		public var y1:Number;
		public var x2:Number;
		public var y2:Number;
		
		public var source:VisualNodeItem; //duplication of underlying data structure for vis purposes
		public var target:VisualNodeItem; //duplication of underlying data structure for vis purposes
		public var directed:Boolean = false; //duplication of underlying data structure for vis purposes
		
		public function get s():Point {	return new Point(x1,y1);	}
		public function get t():Point {	return new Point(x1,y1);	}

		public var arrowType:String = ARROWTYPE_NONE;
		public var arrowWidth:Number = -1;
		public var arrowHeight:Number = -1;
		
		public static const ARROWTYPE_NONE:String = "none";//no arrows should be drawn.
		public static const ARROWTYPE_TRIANGLE:String = "triangle"; //closed triangular arrow head should be drawn.
		public static const ARROWTYPE_LINES:String = "lines"; //two lines should be used to draw the arrow head.

		
		public function VisualEdgeItem(source:VisualNodeItem=null, target:VisualNodeItem=null, directed:Boolean=false) {
			this.source = source;
			this.target = target;
			this.directed = directed;
			
			_lineColor = 0xffcccccc;
			_renderer = EdgeRenderer.instance;
		}
		
		public function other(n:VisualNodeItem):VisualNodeItem {
			if (n == source) return target;
			if (n == target) return source;
			else return null;	
		}
		public function clear():void {
			source = null;
			target = null;
		}
	}
}
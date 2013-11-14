package lemonflow.ui.operators
{
	import flare.util.IEvaluable;
	import flare.util.Property;
	
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	import lemonflow.ui.animation.TweenMax;
	import lemonflow.ui.animation.tweenlite.easing.Quad;
	import lemonflow.ui.base.OperatorInteraction;
	import lemonflow.ui.base.VisualDataItem;
	import lemonflow.ui.base.VisualItem;

	public class OperatorLayout extends OperatorInteraction
	{
		public static const CARTESIAN:String = "cartesian";
		public static const POLAR:String = "polar";
		
		public var layoutType:String = null;

		protected var _rect:Rectangle = new Rectangle();
		protected var _anchor:Point = new Point(0,0);
		protected var _setAnchor:Boolean = false;
		
		private var _bounds:Rectangle = new Rectangle(0,0,500,500);;
		private var _root:VisualDataItem = null;
		
		public static function applyParameters(op:OperatorLayout,params:Object):void
		{
			if (op==null || params==null) return;
			var o:Object = op as Object;
			for (var name:String in params) {
				var p:Property = Property.$(name);
				var v:* = params[name];
				var f:Function = v as Function;
				if (v is IEvaluable) f = IEvaluable(v).eval;
				p.setValue(op, f==null ? v : f(op));
			}
		}
		
		/** @inheritDoc */
		public function set parameters(params:Object):void { applyParameters(this, params);	}

		override public function setup(slots:Vector.<VisualItem>=null):void {}
		override public function update(slots:Vector.<VisualItem> = null, currentIdx:Number = 0, nextIndex:Number = 0):void {
			layout();
		}
		
		protected function layout():void {} // sub-classes should override
		
		//--- helper functions
		protected function autoAnchor():void {
			_anchor.x = (layoutType == POLAR) ? (layoutBounds.left + layoutBounds.right) / 2 : 0;
			_anchor.y = (layoutType == POLAR) ? (layoutBounds.top + layoutBounds.bottom) / 2 : 0;
		}
		
		public function get layoutBounds():Rectangle { if (_bounds != null) return _bounds; return null; }
		public function set layoutBounds(b:Rectangle):void { _bounds = b; }
		public function get layoutAnchor():Point { if (!_setAnchor) autoAnchor(); return _anchor; }
		public function set layoutAnchor(p:Point):void { _anchor = p; _setAnchor = true; }
	    protected function minAngle(a1:Number, a2:Number):Number
		{
			for (; Math.abs(a1-a2) > Math.PI; a2 += (2*Math.PI*(a1 > a2 ? 1 : -1))){}
			return a2;
		}
		
		// -- Edge Helpers ----------------------------------------------------
		private static var _clear:Boolean;
		
		/**
		 * Updates all edges to be straight lines. Useful for undoing the
		 * results of layouts that route edges using edge control points.
		 * @param list a data list of edges to straighten
		 * @param t a transitioner to collect value updates
		 */
//		public static function straightenEdges(list:DataList, t:Transitioner):Transitioner
//		{
//			// set end points to mid-points
//			list.visit(function(e:EdgeSprite):void {
//				if (e.points == null) return;
//				_clear = true;
//				
//				var src:NodeSprite = e.source;
//				var trg:NodeSprite = e.target;
//				
//				// create new control points
//				var i:uint, len:uint = e.points.length, f:Number;
//				var cp:Array = new Array(len);
//				var x1:Number, y1:Number, x2:Number, y2:Number;
//				
//				// get target end points
//				x1 = t.$(src).x; y1 = t.$(src).y;
//				x2 = t.$(trg).x; y2 = t.$(trg).y;
//				
//				for (i=0; i<len; i+=2) {
//					f = (i+2)/(len+2);
//					cp[i]   = x1 + f * (x2 - x1);
//					cp[i+1] = y1 + f * (y2 - y1);
//				}
//				t.$(e).points = cp;
//			});
//			return t;
//		}
		
//		/** @private */
//		protected function updateEdgePoints(t:Transitioner=null):void
//		{
//			if (t==null || t.immediate || layoutType==POLAR) {
//				clearEdgePoints();
//			} else {
//				_clear = false;
//				straightenEdges(visualization.data.edges, t);
//				// after transition, clear out control points
//				if (_clear) {
//					var f:Function = function(evt:Event):void {
//						clearEdgePoints();
//						t.removeEventListener(TransitionEvent.END, f);
//					};
//					t.addEventListener(TransitionEvent.END, f);
//				}
//			}
//		}
//		
//		/**
//		 * Strips all EdgeSprites in a visualization of any control points.
//		 */
//		public function clearEdgePoints():void
//		{
//			visualization.data.edges["points"] = null;
//		}
		
	} // end of class Layout
}
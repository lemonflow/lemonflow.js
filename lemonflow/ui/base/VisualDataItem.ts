package lemonflow.ui.base
{
	import flare.util.Colors;
	
	import flash.geom.Point;

	public class VisualDataItem extends VisualItem
	{
		protected var _prop:Object = {}; //additional properties
		
		protected var _selected:Boolean = false; //selected property
		protected var _fixed:int = 0; //fix at position
		protected var _fillColor:uint = 0xffcccccc; //fill color
		protected var _lineColor:uint = 0xff000000; //line color argb
		protected var _lineWidth:Number = 0; //line width
		protected var _points:Array; //for shaped item renderers (position array)
		protected var _shape:String = "circle"; //shape id
		protected var _size:Number = 1; //size value
		protected var _w:Number = 0;	//width
		protected var _h:Number = 0;	//height
		protected var _u:Number = 0; //shape x
		protected var _v:Number = 0; //shape y
		protected var _radius:Number; 
		protected var _angle:Number; 
		protected var _origin:Point = new Point(0,0); 
		
		protected var _bitmapClass:Class = null;
		protected var _bitmapFromCenter:Boolean = false;
		
		public function get props():Object { return _prop; }
		public function set props(p:Object):void { _prop = p; _prop.self = this; }
		
		public function get selected():Boolean { return _selected; }
		public function set selected(b:Boolean):void { if (b != _selected) {_selected = b; dirty(); } }	
		public function get u():Number { return _u; }
		public function set u(u:Number):void { _u = u; dirty(); }
		public function get v():Number { return _v; }
		public function set v(v:Number):void { _v = v; dirty(); }
		public function get w():Number { return _w; }
		public function set w(v:Number):void { _w = v; dirty(); }
		public function get h():Number { return _h; }
		public function set h(v:Number):void { _h = v; dirty(); }
		public function get fillColor():uint { return _fillColor; }
		public function set fillColor(c:uint):void { _fillColor = c; dirty();	}
		public function get fillAlpha():Number { return Colors.a(_fillColor) / 255; }
		public function set fillAlpha(a:Number):void { _fillColor = Colors.setAlpha(_fillColor, uint(255*a)%256); dirty(); }
		public function get fillHue():Number { return Colors.hue(_fillColor); }
		public function set fillHue(h:Number):void { _fillColor = Colors.hsv(h, Colors.saturation(_fillColor), Colors.value(_fillColor), Colors.a(_fillColor)); dirty(); }
		public function get fillSaturation():Number { return Colors.saturation(_fillColor); }
		public function set fillSaturation(s:Number):void { _fillColor = Colors.hsv(Colors.hue(_fillColor), s, Colors.value(_fillColor), Colors.a(_fillColor)); dirty(); }
		public function get fillValue():Number { return Colors.value(_fillColor); }
		public function set fillValue(v:Number):void { _fillColor = Colors.hsv(Colors.hue(_fillColor), Colors.saturation(_fillColor), v, Colors.a(_fillColor)); dirty(); }
		public function get lineColor():uint { return _lineColor; }
		public function set lineColor(c:uint):void { _lineColor = c; dirty(); }
		public function get lineAlpha():Number { return Colors.a(_lineColor) / 255; }
		public function set lineAlpha(a:Number):void { _lineColor = Colors.setAlpha(_lineColor, uint(255*a)%256); dirty(); }
		public function get lineHue():Number { return Colors.hue(_lineColor); }
		public function set lineHue(h:Number):void { _lineColor = Colors.hsv(h, Colors.saturation(_lineColor), Colors.value(_lineColor), Colors.a(_lineColor)); dirty(); }
		public function get lineSaturation():Number { return Colors.saturation(_lineColor); }
		public function set lineSaturation(s:Number):void { _lineColor = Colors.hsv(Colors.hue(_lineColor), s, Colors.value(_lineColor), Colors.a(_lineColor)); dirty(); }
		public function get lineValue():Number { return Colors.value(_lineColor); }
		public function set lineValue(v:Number):void { _lineColor = Colors.hsv(Colors.hue(_lineColor), Colors.saturation(_lineColor), v, Colors.a(_lineColor)); dirty(); }
		public function get lineWidth():Number { return _lineWidth; }
		public function set lineWidth(w:Number):void { _lineWidth = w; dirty(); }
		public function get size():Number { return _size; }
		public function set size(s:Number):void { _size = s; dirty(); }
		public function get shape():String { return _shape; }
		public function set shape(s:String):void { _shape = s; dirty(); }
		public function get points():Array { return _points; }
		public function set points(p:Array):void { _points = p; dirty(); }
		public function get bitmapFromCenter():Boolean { return _bitmapFromCenter; }
		public function set bitmapFromCenter(b:Boolean):void { _bitmapFromCenter = b; dirty(); }	
		public function get bitmapClass():Class { return _bitmapClass; }
		public function set bitmapClass(c:Class):void { _bitmapClass = c; dirty(); }
		
		//cartesian coordinates
		override public function set x(v:Number):void { _x = v; _radius = NaN; _angle = NaN; }
		override public function get x():Number { return _x; }
		override public function set y(v:Number):void { _y = v; _radius = NaN; _angle = NaN; }
		override public function get y():Number { return _y; }
		public function get width():Number { commitChanges(); return _w; }
		public function get height():Number { commitChanges();  return _h; }
		
		//polar coodinates
		public function get radius():Number { if (isNaN(_radius)) { var cx:Number = x - _origin.x; var cy:Number = y - _origin.y; _radius = Math.sqrt(cx*cx + cy*cy); } return _radius; }
		public function set radius(r:Number):void { _radius = r; applyPolarCoordinates(); }
		public function get angle():Number { if (isNaN(_angle)) _angle = Math.atan2(-(y-_origin.y),(x-_origin.x)); return _angle; }
		public function set angle(a:Number):void { 	_angle = a; applyPolarCoordinates(); }
		public function get origin():Point { return _origin; }
		public function set origin(p:Point):void { 	if (_origin.x != p.x || _origin.y != p.y) {	 _origin = p.clone(); applyPolarCoordinates(); } }
		protected function applyPolarCoordinates():void {
			_x =  _radius * Math.cos(_angle) + _origin.x;
			_y = -_radius * Math.sin(_angle) + _origin.y;
		}
		
		public function VisualDataItem() {
			super();
			_prop.self = this;
		}
		
		public function get fixed():Boolean { return _fixed > 0; }
		public function fix(num:uint=1):void { _fixed += num; }
		public function unfix(num:uint=1):void { _fixed = Math.max(0, _fixed-num); }
	}
}
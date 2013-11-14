package lemonflow.ui.operators
{
	import lemonflow.ui.base.OperatorInteraction;
	import lemonflow.ui.base.UIDataGroupFlex;
	import lemonflow.ui.base.VisualItem;

	public class OperatorMorpher extends OperatorInteraction {
		public var operators:Array = new Array();
		public var component:UIDataGroupFlex = null;
		
		public var operatedValues:Array = new Array();
			
		public var inbetweenValue:Number = 0;
		
		public function OperatorMorpher(v:UIDataGroupFlex) { 
			super(); 
			component = v;
			var b:Array;
			for(var j:int = 0; j<v.operators.length; j++) {
				operatedValues.push(b=new Array());
				for(var i:int = 0; i<component.numberOfSlots; i++) {
					b.push(new Object());
				}
			}
		}
		
		override public function update(s:Vector.<VisualItem> = null, currentIdx:Number = 0, nextIndex:Number = 0):void {
			//store the state of the displayobjects for each operator
			var o:Object;
			var b:Array;
			
			for(var j:int = 0; (j< 2 && Math.floor(inbetweenValue)+j < operators.length); j++) {
				var num:int = Math.max(0,Math.floor(inbetweenValue))+j;
				var operator:OperatorInteraction = OperatorInteraction(operators[num]);
				if(operator == null)
					return;
				operator.update(s, 0, 0);
				for(var i:int = 0; i<s.length; i++) {
					o=operatedValues[j][i];
					o["x"] = s[i].x;
					o["y"] = s[i].y;
					o["z"] = s[i].z;
					o["alpha"] = s[i].alpha;
					o["visible"] = s[i].visible;
					o["rotationX"] = s[i].rotationX;
					o["rotationY"] = s[i].rotationY;
					o["rotationZ"] = s[i].rotationZ;
				}
			}
			
			//set the interpolated values
			for(var i2:int = 0; i2<s.length; i2++) {
				var avgX:Number = 0;
				var avgY:Number = 0;
				var avgZ:Number = 0;
				var avgA:Number = 0;
				var scale:Number = inbetweenValue - Math.floor(inbetweenValue);
				
				for(var j2:int = 0; j2<2; j2++) {
					avgX += operatedValues[j2][i2].x 	* (j2==0?1-scale:scale);
					avgY += operatedValues[j2][i2].y 	* (j2==0?1-scale:scale);
					avgZ += operatedValues[j2][i2].z 	* (j2==0?1-scale:scale);
					avgA += operatedValues[j2][i2].alpha * (j2==0?1-scale:scale);
				}
				s[i2].x 	= avgX;
				s[i2].y 	= avgY;
				s[i2].z 	= avgZ;
				s[i2].alpha = avgA;
			}
		}
	} 
}
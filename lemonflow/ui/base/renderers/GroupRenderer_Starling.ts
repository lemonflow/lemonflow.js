package lemonflow.ui.base.renderers {
	
	import lemonflow.ui.animation.TweenMax;
	import lemonflow.ui.animation.tweenlite.easing.Expo;
	import lemonflow.ui.animation.tweenlite.easing.Quad;
	import lemonflow.ui.base.IUIDataGroup;
	import lemonflow.ui.base.VisualItem;
	
	import mx.core.IFactory;
	
	import starling.display.DisplayObject;
	import starling.display.DisplayObjectContainer;
	
	public class GroupRenderer_Starling  {
		
		public var childRenderers:Array = new Array(); //Array of VisualItems to be rendered
		public var transitioner:int = -1;
		
		//the rendering surface
		public var rendererCanvas:DisplayObjectContainer;
		public var perspectiveTransform:Object	= {x:400, y:240, f:60};
		
		
		public function GroupRenderer_Starling(surface:DisplayObjectContainer, useParent:Boolean = false) {
			rendererCanvas = useParent?surface.parent:surface;
		}
		
		public function set renderSurface(surface:DisplayObjectContainer):void {
			rendererCanvas = surface;
//			var p:PerspectiveProjection = new PerspectiveProjection();
//			p.fieldOfView = perspectiveTransform.f;
//			p.projectionCenter= new Point(perspectiveTransform.x, perspectiveTransform.y);
//			_renderSurface.transform.perspectiveProjection = p;
		}
		
		public function addChild(v:VisualItem):void {
			v.render= IFactory(v.factory).newInstance();
			rendererCanvas.addChild(v.render);
			
		}
		
		public function removeChild(v:VisualItem):void {
			rendererCanvas.removeChild(v.render);
			childRenderers.pop(); 
			v.render = null;
		}
		
		public function newChildList(factory:IFactory, number:int):void {
			for(var i:Number=0; i<number; i++) 
				newChild(factory);
		}
		
		public function newChild(factory:IFactory):VisualItem {
			var ri:DisplayObject = factory.newInstance();
			childRenderers.push(ri); 
			rendererCanvas.addChild(ri);
			
			var vi:VisualItem = new VisualItem();
			vi.render = ri;
			return vi;
		}
		
		public function validateDisplayList(slots:Vector.<VisualItem>):void {
			var values:VisualItem;
			var child:DisplayObject;
			var i:int = 0;
			
			
			for(i=0; i< slots.length; i++) {
				values = slots[i];
				child = childRenderers[i];
				if(transitioner == -1) {
					child.x = values.x;
					child.y = values.y;
					child.z = values.z;
					child.alpha = values.alpha;
					child.visible = values.visible;
					child.rotationY = values.rotationY;
					child.rotationX = values.rotationX;
					child.rotationZ = values.rotationZ;
					child.scaleX = values.scaleX;
					child.scaleY = values.scaleY;
				} else {
					TweenMax.to(child, transitioner, { 
						x:values.x, 
						y:values.y, 
						z:values.z, 
						alpha:values.alpha, 
						visible:values.visible, 
						rotationY:values.rotationY, 
						rotationX:values.rotationX, 
						rotationZ:values.rotationZ, 
						scaleX:values.scaleX, 
						scaleY:values.scaleY, 
						ease:Quad.easeInOut
					});
				}
			}
		}
		
		public function sortLayeringByZ():void {
			var sc:Vector.<DisplayObject> = new Vector.<DisplayObject>(childRenderers.length);
			var f1:Function = function (d:DisplayObject, idx:int, v:Object ):void { sc[idx] = d;};
			childRenderers.forEach(f1);
			
			
			sc.sort(
				function(b1:DisplayObject, b2:DisplayObject):Number 
				{  return (b1.z < b2.z)?1:(b1.z > b2.z?-1:0);  }
			);
			
			var f2:Function = function(item:DisplayObject, index:int, vector:Vector.<DisplayObject>):void {
				rendererCanvas.setChildIndex(item, index);
			};
			sc.forEach(f2);
		};
	}
}

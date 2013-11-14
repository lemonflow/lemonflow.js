package lemonflow.ui.operators
{
	import flare.data.Data;
	import lemonflow.ui.base.VisualDataItem;
	
	import flash.geom.Rectangle;
	
	/**
	 * Layout that places nodes randomly within the layout bounds.
	 */
	public class RandomLayout extends OperatorLayout
	{
		public var groupName:String;

		public function RandomLayout(group:String=Data.NODES) {
			this.groupName = group;
		}
		
		protected override function layout():void {
			group.dataStructure.visit(
				function(d:VisualDataItem):void {
					d.x = layoutBounds.x + layoutBounds.width * Math.random();
					d.y = layoutBounds.y + layoutBounds.height * Math.random();
				}, groupName
			);
		}
	} 
}
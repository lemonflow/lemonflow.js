package lemonflow.ui.base
{
	public class DataRenderer
	{
		private var _data:Object;
		
		public function DataRenderer() {}
		
		public function get data():Object { return _data;	}
		public function set data(value:Object):void { _data = value; }
	}
}
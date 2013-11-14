package lemonflow.ui.base
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.utils.IDataInput;
	import flash.utils.IDataOutput;
	import flash.utils.IExternalizable;
	import flash.utils.Proxy;
	import flash.utils.flash_proxy;
	import flash.utils.getQualifiedClassName;
	
	import mx.core.IPropertyChangeNotifier;
	import mx.events.PropertyChangeEvent;
	import mx.events.PropertyChangeEventKind;
	import mx.utils.ObjectUtil;
	import mx.utils.UIDUtil;
	import mx.utils.object_proxy;
	
	use namespace flash_proxy;
	use namespace object_proxy;

	public dynamic class TransformableSlot extends Proxy implements IExternalizable, IPropertyChangeNotifier {
		
		protected var dispatcher:EventDispatcher;
		protected var notifiers:Object;
		protected var proxyClass:Class = TransformableSlot;
		protected var propertyList:Array;
		
		private var _proxyLevel:int;
		private var _item:Object;
		
		private var _type:QName;
		private var _id:String;
		
		public function TransformableSlot(item:Object = null, uid:String = null, proxyDepth:int = -1) {
			super();
			
			if (!item) item = {};
			_item = item;
			_proxyLevel = proxyDepth;
			notifiers = {};
			dispatcher = new EventDispatcher(this);
			
			if (uid) _id = uid;
		}
		
		override flash_proxy function getProperty(name:*):* {
			var result:*;
			
			if (notifiers[name.toString()])
				return notifiers[name];
			
			result = _item[name];
			
			if (result)
			{
				if (_proxyLevel == 0 || ObjectUtil.isSimple(result))
				{
					return result;
				}
				else
				{
					result = object_proxy::getComplexProperty(name, result);
				} // if we are proxying
			}
			
			return result;
		}
		
		override flash_proxy function callProperty(name:*, ... rest):* {
			return _item[name].apply(_item, rest)
		}
		
		override flash_proxy function deleteProperty(name:*):Boolean
		{
			var notifier:IPropertyChangeNotifier = IPropertyChangeNotifier(notifiers[name]);
			if (notifier)
			{
				notifier.removeEventListener(PropertyChangeEvent.PROPERTY_CHANGE,
					propertyChangeHandler);
				delete notifiers[name];
			}
			
			var oldVal:* = _item[name];
			var deleted:Boolean = delete _item[name]; 
			
			if (dispatcher.hasEventListener(PropertyChangeEvent.PROPERTY_CHANGE))
			{
				var event:PropertyChangeEvent = new PropertyChangeEvent(PropertyChangeEvent.PROPERTY_CHANGE);
				event.kind = PropertyChangeEventKind.DELETE;
				event.property = name;
				event.oldValue = oldVal;
				event.source = this;
				dispatcher.dispatchEvent(event);
			}
			
			return deleted;
		}
		
		override flash_proxy function hasProperty(name:*):Boolean
		{
			return(name in _item);
		}
		
		override flash_proxy function nextName(index:int):String
		{
			return propertyList[index -1];
		}
		
		override flash_proxy function nextNameIndex(index:int):int
		{
			if (index == 0) {
				if (getQualifiedClassName(_item) == "Object") {
					propertyList = [];
					for (var prop:String in _item)
						propertyList.push(prop);
				} else {
					propertyList = ObjectUtil.getClassInfo(_item, null, {includeReadOnly:true, uris:["*"]}).properties;
				}
			}
			
			if (index < propertyList.length)
			{
				return index + 1;
			}
			else
			{
				return 0;
			}
		}
		
		override flash_proxy function nextValue(index:int):*
		{
			return _item[propertyList[index -1]];
		}
		
		override flash_proxy function setProperty(name:*, value:*):void
		{
			var oldVal:* = _item[name];
			if (oldVal !== value)
			{
				// Update item.
				_item[name] = value;
				
				// Stop listening for events on old item if we currently are.
				var notifier:IPropertyChangeNotifier =
					IPropertyChangeNotifier(notifiers[name]);
				if (notifier)
				{
					notifier.removeEventListener(
						PropertyChangeEvent.PROPERTY_CHANGE,
						propertyChangeHandler);
					delete notifiers[name];
				}
				
				// Notify anyone interested.
				if (dispatcher.hasEventListener(PropertyChangeEvent.PROPERTY_CHANGE))
				{
					if (name is QName)
						name = QName(name).localName;
					var event:PropertyChangeEvent =
						PropertyChangeEvent.createUpdateEvent(
							this, name.toString(), oldVal, value);
					dispatcher.dispatchEvent(event);
				} 
			}
		}
		
		object_proxy function getComplexProperty(name:*, value:*):*
		{
			if (value is IPropertyChangeNotifier)
			{
				value.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE,
					propertyChangeHandler);
				notifiers[name] = value;
				return value;
			}
			
			if (getQualifiedClassName(value) == "Object")
			{
				value = new proxyClass(_item[name], null,
					_proxyLevel > 0 ? _proxyLevel - 1 : _proxyLevel);
				value.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE,
					propertyChangeHandler);
				notifiers[name] = value;
				return value;
			}
			
			return value;
		}
		
		object_proxy function get object():Object { return _item; }
		object_proxy function get type():QName { return _type; }
		object_proxy function set type(value:QName):void { _type = value; }
		public function get uid():String { if (_id === null) _id = UIDUtil.createUID(); return _id; }
		public function set uid(value:String):void { _id = value; }
		
		
		public function readExternal(input:IDataInput):void { _item = input.readObject(); }
		public function writeExternal(output:IDataOutput):void { output.writeObject(_item); }
		
		//EventDispatcher duplication
		public function addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0,  useWeakReference:Boolean = false):void { dispatcher.addEventListener(type, listener, useCapture, priority, useWeakReference); }
		public function removeEventListener(type:String, listener:Function, useCapture:Boolean = false):void { dispatcher.removeEventListener(type, listener, useCapture); }
		public function dispatchEvent(event:Event):Boolean	{ return dispatcher.dispatchEvent(event); }
		public function hasEventListener(type:String):Boolean { return dispatcher.hasEventListener(type); }
		public function willTrigger(type:String):Boolean { return dispatcher.willTrigger(type); }
		public function propertyChangeHandler(event:PropertyChangeEvent):void { dispatcher.dispatchEvent(event); }
	}
}
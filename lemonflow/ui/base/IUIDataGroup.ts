interface IUIDataGroup
	{
		/** render surface **/
//		set renderer(v:*):void;
//		renderer():*;
		
		invalidate():void;
		
		createChildComponents():void;
		applyOperators():void;
		getDataRenderer(idx:number):VisualItem;
		getDataRendererId(idx:number):number;
		/** states for mapped renderers **/
		registerState(identifier:String, stateName:String):void;
		
		/** interaction methods / selection handling **/
		scrollRelative(step:Number, duration:Number):boolean; //second parameter defines the duration for each individual scrolling operation of the list
		scrollAbsolute(target:Number, duration:Number):boolean;
        
        
		selectedIndex:number;
		currentIndex:number;
		initSelectedIndex:number;
		direction:number;
		oldSelectedIndex:number;
		
		/** surface updates **/
		renderer;
		
		/** data provider **/
		dataProvider;
		dataStructure;	
		
		/** renderers factories **/
		itemRenderer;
		highlight;
		
		/* instances */		
		slots;
		renderers;
		numberOfSlots:number;
		
		/** general positioning and parameters **/
		continuousUpdates:boolean;
		wrapAround:boolean;
		highlightOnTop:boolean;
		centerRenderers:boolean;
		centerRenderersVertical:boolean;
		perspectiveXYF:Object;
		centerXYZ:Object;
		radiusXYZ:Object;
		
		/** transition **/
		transitionDuration:number;
		easing:string;
	}

//
//
//interface IUIDataGroup
//	{
//		/** render surface **/
////		set renderer(v:*):void;
////		renderer():*;
//		
//		invalidate():void;
//		
//		createChildComponents():void;
//		applyOperators():void;
//		getDataRenderer(idx:number):VisualItem;
//		getDataRendererId(idx:number):number;
//		/** states for mapped renderers **/
//		registerState(identifier:String, stateName:String):void;
//		
//		/** interaction methods / selection handling **/
//		scrollRelative(step:Number, duration:Number):boolean; //second parameter defines the duration for each individual scrolling operation of the list
//		scrollAbsolute(target:Number, duration:Number):boolean;
//        
//        
//		selectedIndex:number;
//		currentIndex:number;
//		initSelectedIndex:number;
//		direction:number;
//		oldSelectedIndex:number;
//		
//		/** surface updates **/
//		renderer;
//		
//		/** data provider **/
//		dataProvider;
//		dataStructure;	
//		
//		/** renderers factories **/
//		itemRenderer;
//		highlight;
//		
//		/* instances */		
//		slots;
//		renderers;
//		numberOfSlots:number;
//		
//		/** general positioning and parameters **/
//		continuousUpdates:boolean;
//		wrapAround:boolean;
//		highlightOnTop:boolean;
//		centerRenderers:boolean;
//		centerRenderersVertical:boolean;
//		perspectiveXYF:Object;
//		centerXYZ:Object;
//		radiusXYZ:Object;
//		
//		/** transition **/
//		transitionDuration:number;
//		easing:string;
//	}
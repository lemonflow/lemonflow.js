function UIGroupSprite (parentView) {
    this.renderer  = {};
    this.reuseDataRenders                = false;

    //ui components renderer factories & instances
    this.renderFactory = null; //of Starling DisplayObjects
    this.rendererHighlightFactory = null; //renderer class for highlights
    this.highlightRenderer = {}

    //parameters of list
    this.transitionDuration         = 500;
    this.transitionEasing           = "easeOutQuad";
    this._wrapAround                 = false;
    this._highlightOnTop             = false;
    this._contentCenterXYZ           = {x:0, y:0, z:0};
    this._contentRadiusXYZ           = {x:190, y:77, z:190};
    this._visible                    = false;
    this._centerRenderers            = true;
    this._centerRenderersVertical    = false;
    this.numberOfSlots                  = 6;
    this._continuousUpdates          = false;
    this._transitioner               = false;

    this.slots = [];
    this.animChildProperties = [];

    //state handling of the item renderers
    this._itemStates  = {};

    //data cursors and model
    this.dataProvider = null;
    this.dataStructure = null; //unstructured or graph-like collection of data to render
    this.dataNodes = [];
    this.dataEdges = [];

    this.dataPresenter = null;

    //2d and 3d item flyweight renderers
    this.dataRendererMap = []
    this.dataRendererMapping = []
    this.dataRendererUpdateSpread = -1;

    //interaction and positioning
    this.interactionHandler = null;
    this.controllers = [];
    this.operators = [];

    this.lifecycleState = 0;
    this.stateMap = {}


    this.viewdata = {};

    this.surface = null;

    //    //constructor
    //    _dataHandler = new DataAdapter(this);
    this.renderer = null;

    ////abstract methods - subclass must overide
    //UIGroupSprite.prototype.boundaryCheck(idx, oldidx) = function() {
    //    return true;
    //}

    ////called when element is added to the displaylist
    //UIGroupSprite.prototype.setParent(value) = function() {
    //    createChildComponents();
    //}

    //_______ handling of children, operators, data mapping and interactions ---- //
    this.createChildComponents = function() {
        if(!this.renderFactory) return;
        if(!this.renderer) this.renderer = new GroupRenderer_QtScenegraph(this.surface);
        if(!this.interactionHandler) { this.interactionHandler = new InteractionState(); this.interactionHandler.view = this; }
        if(!this.dataPresenter) {this.dataPresenter = new DataPresenter(); this.dataPresenter.view = this; }

        //    if(dataStructure != null)
        //        numberOfSlots = dataStructure.nodes.length;

        //    //highlight on bottom
        //    if(rendererHighlightFactory!=null && !_highlightOnTop && highlightRenderer ==null) {
        //        highlightRenderer = new VisualItem();
        //        highlightRenderer.factory = rendererHighlightFactory;
        //        renderer.addChild(highlightRenderer);
        //    }

        //remove old components and add new components to the list
        var oldNumberOfSlots = this.slots.length;
        for(var i =oldNumberOfSlots; i<this.numberOfSlots; i++) {
            this.slots.push(this.renderer.newChild(this.renderFactory)); //adds it to the slots array
//            if(this.reuseDataRenders) {
//                this.dataRendererMap.push(this.slots[i]);
//                this.dataRendererMapping.push(-1);
//            }
        }
        for(var i = oldNumberOfSlots-1; i>=this.numberOfSlots; i--) {
            this.renderer.removeChild(this.slots[i]);
            this.slots.pop();
//            if(this.reuseDataRenders) {
//                this.dataRendererMap.pop();
//                this.dataRendererMapping.pop();
//            }
        }

        console.log("adding "+(this.numberOfSlots-oldNumberOfSlots)+" to view, definition:" + this.renderFactory.url);

        //    //highlight on top
        //    if(rendererHighlightFactory!=null && _highlightOnTop && highlightRenderer ==null) {
        //        highlightRenderer = new VisualItem();
        //        highlightRenderer.factory = rendererHighlightFactory;
        //        renderer.addChild(highlightRenderer);
        //    }

        this.lifecycleState = 1;

        //assign the data
        this.dataPresenter.init();


        //var animProxy:AnimProxy = new AnimProxy();
        //    for each (var o in slots)
        //    animChildProperties.push(animProxy.init(o));

        this.invalidate();
    }

    this.invalidate = function() {
        this.applyOperators();
//        renderer.validateDisplayList(slots);
    }

    //operators will access and change the properties of children (visualitems)
   this.applyOperators = function() {
        if(this.slots == null || this.slots.length == 0)
            return;

        for(var i=0; i< this.operators.length; i++) {
            var o = this.operators[i]

            if(o.group==null || o.group!=this) o.group = this;
            if(!o.active) continue;


            o.update(this.slots, this.interactionHandler.currentIndex, this.interactionHandler.selectedIndex);

            if(this.dataStructure) {
                for (var i = 1; i < (this.dataStructure?this.dataStructure.nodes:slots).length; i++) {
                    slots[i-1].x = (this.dataStructure?this.dataStructure.nodes[i]:slots[i]).x;
                    slots[i-1].y = (this.dataStructure?this.dataStructure.nodes[i]:slots[i]).y;
                }
            }

            //              if(transitioner==true && ) {
            //                  //crossfade shapes
            ////                    var items = (dataStructure?dataStructure.nodes:slots);
            ////                    for (var i = 1; i < items.length; i++) {
            ////                    }
            //              }

            if(o.sortByZ) this.renderer.sortLayeringByZ();
        }


            for(var j=0; j< this.controllers.length; j++) {
            var o2 = this.controllers[j]
            if(o2.view==null) o2.view = this;
            if(o2.active) o2.update();
        }
    }



    this.updateAllDataRenderer = function() {
        if(this.dataRendererUpdateSpread == -1) return;

        for(var i = -this.dataRendererUpdateSpread + this.selectedIndex;i<=this.dataRendererUpdateSpread + this.selectedIndex+1;i++) {
            this.updateDataRenderer(i);
        }
    }
    //UIGroupSprite.prototype.updateDataRenderer(idx)= function() {
    //    if(dataRendererMapping[idx%_numberOfSlots] != idx) {
    //        dataRendererMapping[idx%_numberOfSlots] = idx;
    //    }
    //    renderers[idx%_numberOfSlots].data =
    //            (dataRendererMap[idx%_numberOfSlots] as VisualItem).data =
    //            _dataHandler.getDataContent(wrapAround?idx%_numberOfSlots:idx);
    //}

    //UIGroupSprite.prototype.getDataRenderer(idx)= function() {
    //    if(dataRendererMapping[idx%_numberOfSlots] != idx)
    //        dataRendererMapping[idx%_numberOfSlots] = idx;
    //    return dataRendererMap[idx%_numberOfSlots];
    //}
    //UIGroupSprite.prototype.getDataRendererId(idx)= function() { return idx%_numberOfSlots; }


    ///** states for mapped renderers **/
    //UIGroupSprite.prototype.registerState(identifier, stateName) = function() { stateMap[identifier] = stateName; renderer.validateDisplayList(slots); }

    ///** interaction methods / selection handling **/
    this.scrollRelative = function(step, duration) { return this.interactionHandler.scrollRelative(step, duration); }
    this.scrollAbsolute = function(target, duration) { this.updateAllDataRenderer(); return this.interactionHandler.scrollAbsolute(target, duration); }
    //UIGroupSprite.prototype.setselectedIndex(s)= function() { _interactionHandler.selectedIndex = s;   }
    //UIGroupSprite.prototype.getselectedIndex() { return _interactionHandler.selectedIndex; }
    //UIGroupSprite.prototype.setcurrentIndex(s)= function() { _interactionHandler.currentIndex = s;  renderer.validateDisplayList(slots);}
    //UIGroupSprite.prototype.getcurrentIndex() { return _interactionHandler.currentIndex; }


    ///** renderers factories **/
    //UIGroupSprite.prototype.setitemRenderer(value)= function() { renderFactory = value; renderer.validateDisplayList(slots); }
    //UIGroupSprite.prototype.getitemRenderer()= function() { return renderFactory; }
    //UIGroupSprite.prototype.setcursorRenderer(value)= function() { rendererHighlightFactory = value;  renderer.validateDisplayList(slots); }
    //UIGroupSprite.prototype.gethighlight() = function() {return highlightRenderer.render; }

    ///** instances and count **/
    //UIGroupSprite.prototype.getrenderers()= function() { return renderer.childRenderers; }
        this.s_numberOfSlots = function(s) { this.numberOfSlots = s; if(this.lifecycleState>=1) this.createChildComponents();}
    //UIGroupSprite.prototype.getnumberOfSlots()= function() { return _numberOfSlots; }

    ///** general positioning and parameters **/
    //private var f:Function;
    //UIGroupSprite.prototype.setcontinuousUpdates(v)= function() {
    //    if(v==_continuousUpdates) return;
    //    if(v) addEventListener(Event.ENTER_FRAME, (f=function(e)= function() { invalidate() }) );
    //    else removeEventListener(Event.ENTER_FRAME, f);
    //    _continuousUpdates = v;
    //};

    //UIGroupSprite.prototype.getcontinuousUpdates()= function() { return _continuousUpdates; };
    //UIGroupSprite.prototype.settransitioner(v)= function() { _transitioner = v; renderer.transitioner = v?1.0:-1};
    //UIGroupSprite.prototype.gettransitioner()= function() { return _transitioner; };
    //UIGroupSprite.prototype.setperspectiveXYF(f)= function() { renderer.perspectiveTransform = f;  renderer.validateDisplayList(slots); }
    //UIGroupSprite.prototype.getperspectiveXYF()= function() { return renderer.perspectiveTransform; }
    //UIGroupSprite.prototype.setcenterXYZ(f)= function() { _contentCenterXYZ = f; renderer.validateDisplayList(slots); }
    //UIGroupSprite.prototype.getcenterXYZ()= function() { return _contentCenterXYZ; }
    //UIGroupSprite.prototype.setradiusXYZ(f)= function() { _contentRadiusXYZ = f; renderer.validateDisplayList(slots); }
    //UIGroupSprite.prototype.getradiusXYZ()= function() { return _contentRadiusXYZ; }

}

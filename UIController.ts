Qt.include("Lemonflow.js")

Qt.include("UIContext.js")
Qt.include("TransitionRadioRename.js")
Qt.include("TransitionRadioNormal.js")
Qt.include("TransitionScroll.js")
Qt.include("OperatorRadioLayout.js")
Qt.include("RadioFlowList.js")

var instance = null;
function init(v) {
    this.instance = new UIController();
    this.instance.context.view = v;
    this.instance.context.controller = this.instance;
    this.instance.setup();
}

//--

UIController.prototype = Object.create(OperatorStates.prototype);

function UIController() {
    OperatorStates.apply(this, arguments);

    this.context            = new UIContext();
    this.radioFlowList      = {};
    this.flow               =
         [
             {
                 state:"main",
                 changes:
                 [
                     {type:"zbe",
                         transition:[TransitionScroll],
                         newState:"main2"}
                 ]
             },

             {
                 state:"main2",
                 changes:
                 [

                     {type:"zbe",
                         transition:[TransitionRadioRename],
                         newState:"main3"}
                 ]
             },

             {
                 state:"main3",
                 changes:
                 [

                     {type:"zbe",
                         transition:[TransitionRadioNormal],
                         newState:"main"}
                 ]
             }
         ];


    this.setup = function() {
        Tweener.timerObj = Qt.createQmlObject("import QtQuick 2.0; Timer { id: timer1 }", this.context.view, "timer");
        this.createChildObjects();
    }

    this.createChildObjects = function() {
        this.radioFlowList = new RadioFlowList();
        this.radioFlowList.renderFactory = Qt.createComponent("RadioFlowItem.qml");
        this.radioFlowList.dataProvider =[{name:"Navi"},{name:"Media"},{name:"Radio"},
                                          {name:"Phone"},{name:"Compass"},{name:"Contacts"},
                                          {name:"USB"},{name:"Settings"}, {name:"Satellite"}];
        this.radioFlowList.surface = this.context.view;
        this.radioFlowList.createChildComponents();
    }

    this.mouse = function(e) {
        this.processInput({type:"zbe"});
    }
}



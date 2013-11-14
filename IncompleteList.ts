IncompleteList.prototype = Object.create(Array.prototype);

function IncompleteList() {
    Array.apply(this, arguments);

    this.collection	= [];
    this.defaultItemGenerator = {};
//  this.defaultItemGenerator = { index:0, label:"Facebook", image:"assets-shanghai/icon_facebook.png", next:"assets-shanghai/data/home_menuitems_layer12.xml"}
    this.structuralInformation = {count:0, groupCount:1};
}

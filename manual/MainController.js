Qt.include("lemonflow.js")

function MainController() {
    this.states	= []
    this.view = null;

    this.start = function(v) {
        this.view = v;
    }
}

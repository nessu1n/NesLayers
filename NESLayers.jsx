
function createDockableUI(thisObj) {
    var dialog =
        thisObj instanceof Panel
            ? thisObj
            : new Window("window", undefined, undefined, { resizeable: true });
    dialog.onResizing = dialog.onResize = function () {
        this.layout.resize();
    };
    return dialog;
}

function showWindow(myWindow) {
    if (myWindow instanceof Window) {
        myWindow.center();
        myWindow.show();
    }
    if (myWindow instanceof Panel) {
        myWindow.layout.layout(true);
        myWindow.layout.resize();
    }
}


var panelGlobal = this;

// DIALOG
// ======
var dialog = (panelGlobal instanceof Panel) ? panelGlobal : new Window("palette");
if (!(panelGlobal instanceof Panel)) dialog.text = "NESLayers";
dialog.preferredSize.width = 80;
dialog.orientation = "column";
dialog.alignChildren = ["center", "top"];
dialog.spacing = 10;
dialog.margins = 16;

// GROUP1
// ======
var group1 = dialog.add("group", undefined, { name: "group1" });

group1.orientation = "row";
group1.alignChildren = ["left", "center"];
group1.spacing = 6;
group1.margins = 0;

var AdjLayerButton = group1.add("button", undefined, undefined, { name: "AdjLayerButton" });
AdjLayerButton.text = "Adjust";
AdjLayerButton.alignment = ["left", "center"];
AdjLayerButton.size = [60,30];

var NullLayerButton = group1.add("button", undefined, undefined, { name: "NullLayerButton" });
NullLayerButton.text = "Null";
NullLayerButton.alignment = ["left", "center"];
NullLayerButton.size = [60,30];

var SolidLayerButton = group1.add("button", undefined, undefined, { name: "SolidLayerButton" });
SolidLayerButton.text = "Solid";
SolidLayerButton.alignment = ["left", "center"];
SolidLayerButton.size = [60,30];


var group2 = dialog.add("group", undefined, { name: "group2" });
group2.orientation = "row";
group2.alignChildren = ["left", "center"]
group2.spacing = 6;
group2.margins = 0;



var FrameButton = group2.add("button", undefined, undefined, { name: "FrameButton" });
FrameButton.text = "Frame";
FrameButton.alignment = ["left", "center"];
FrameButton.size = [60,30];

var SeqButton = group2.add("button", undefined, undefined, { name: "SeqButton" });
SeqButton.text = "Sequence";
SeqButton.alignment = ["left", "center"];
SeqButton.size = [60,30];

var AnchorButton = group2.add("button", undefined, undefined, { name: "AnchorButton" });
AnchorButton.text = "Anchor";
AnchorButton.alignment = ["left", "center"];
AnchorButton.size = [60,30];





dialog.layout.layout(true);
dialog.layout.resize();
dialog.onResizing = dialog.onResize = function () { this.layout.resize(); }

if (dialog instanceof Window) dialog.show();


AdjLayerButton.onClick = function () {
    var comp = app.project.activeItem;
    app.beginUndoGroup("Adjustment Layer");
    if (comp.selectedLayers.length == 0) {

        var adjlayer = app.executeCommand(2279);

    }
    else {


        var layer = comp.selectedLayers[0];

        app.executeCommand(2279);
        var adjLayer = comp.selectedLayers[0]
        adjLayer.moveBefore(layer);
        adjLayer.inPoint = layer.inPoint;
        adjLayer.outPoint = layer.outPoint


    }
    app.endUndoGroup();
}
FrameButton.onClick = function () {
    var comp = app.project.activeItem;

    if (comp.selectedLayers.length == 0) {
        alert("Select a Layer")
    }
    else {

        app.beginUndoGroup("Adjustment Layer");
        var currentTime = comp.time;
        var layer = comp.selectedLayers[0]

        app.executeCommand(2279);
        var adjLayer = comp.selectedLayers[0]
        adjLayer.moveBefore(layer);


        adjLayer.outPoint = comp.frameDuration;
        adjLayer.inPoint = currentTime;
        app.endUndoGroup();

    }

}

NullLayerButton.onClick = function () {

    var comp = app.project.activeItem;
    app.beginUndoGroup("Null");

    if (comp.selectedLayers.length == 0) {
        var nullLayer = comp.layers.addNull(comp.duration)
    }
    else {

        var layer = comp.selectedLayers[0];

        var nullLayer = comp.layers.addNull();
        nullLayer.moveBefore(layer);
        layer.parent = nullLayer;
        nullLayer.inPoint = layer.inPoint;
        nullLayer.outPoint = layer.outPoint;


    }
    app.endUndoGroup();
};

SolidLayerButton.onClick = function () {
    var comp = app.project.activeItem;
    app.beginUndoGroup("Null");
    if (comp.selectedLayers.length == 0) {
        var solidLayer = comp.layers.addSolid([0, 0, 0], "Solid Layer", comp.width, comp.height, 1, comp.duration)
    }
    else {

        var layer = comp.selectedLayers[0];

        app.executeCommand(2038);
        var solidLayer = comp.selectedLayers[0];
        solidLayer.moveBefore(layer);

        solidLayer.inPoint = layer.inPoint;
        solidLayer.outPoint = layer.outPoint;


    };
    app.endUndoGroup()
};

AnchorButton.onClick = function () {
    app.executeCommand(10312)
};

var timeDifference;
var clipLayer = null;
var currentTime;
SeqButton.onClick = function () {

    var comp = app.project.activeItem;

    if (comp.selectedLayers[0].adjustmentLayer == false) {
        clipLayer = comp.selectedLayers[0]
        timeDifference = clipLayer.inPoint
        currentTime = comp.time;
        currentTime = currentTime - timeDifference
    }

    if (clipLayer == null) {
        alert("Select a layer to sequence")
        return
    }


    var currentSelectedLayer = comp.selectedLayers[0];

    var duration = clipLayer.outPoint - clipLayer.inPoint;
    var half = duration * 0.5;

    app.beginUndoGroup("Adjustment Layer")
    app.executeCommand(2279);

    var adjLayer = comp.selectedLayers[0]


    if (currentTime <= half) {

        if (currentSelectedLayer.adjustmentLayer == true) {
            adjLayer.moveBefore(currentSelectedLayer);
            adjLayer.outPoint = comp.frameDuration;
            adjLayer.inPoint = currentSelectedLayer.outPoint;
        }
        else {
            adjLayer.outPoint = comp.frameDuration;
            adjLayer.inPoint = currentSelectedLayer.inPoint;
        }
    }

    if (currentTime > half) {

        if (currentSelectedLayer.adjustmentLayer == true) {
            adjLayer.moveAfter(currentSelectedLayer);
            adjLayer.outPoint = comp.frameDuration;
            adjLayer.inPoint = (currentSelectedLayer.inPoint - comp.frameDuration);
        }
        else {
            adjLayer.outPoint = comp.frameDuration;
            adjLayer.inPoint = (currentSelectedLayer.outPoint - comp.frameDuration)
        }
    }
    app.endUndoGroup();

};

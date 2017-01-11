/*global BABYLON*/
/*global canvas*/
function camera(scene,go){
    var camera = new BABYLON.FollowCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene,go["sphere"]);
        camera.checkCollisions = true;
        //camera.applyGravity = true;
        //camera.setTarget(BABYLON.Vector3.Zero());
        camera.radius = 40;
        camera.attachControl(canvas, false); 
    
    return camera;
}


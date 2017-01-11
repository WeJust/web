/*global BABYLON,engine,materials,gameobjects,camera,light,update,inputevents*/
var createScene = function() {
    // create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    scene.enablePhysics();

    /****************** Preload **********************/
    var mat = materials(scene); // load all materials
    var go = gameobjects(scene,mat); // load all game objects
    var cam = camera(scene,go); // load camera(s)
    var lig = light(scene); // load light(s)
    /******************END Preload **********************/


    inputevents(scene,go);

    update(scene,engine,mat,go,cam,lig);

    return scene;
}

/*global BABYLON*/
function gameobjects(scene,mat){
        var AllGameObjects = {}
    // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
    var sphere = BABYLON.Mesh.CreateSphere('sphere', 16, 2, scene);
    sphere.position.x = 1;
    sphere.position.y = 1;
    sphere.position.z = 1;
    sphere.material = mat["materialSphere2"];
    sphere.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
    sphere.checkCollisions = true;
    sphere.applyGravity = true;
    AllGameObjects["sphere"] = sphere;


    /* boxes generation */
    for (var i = 0; i < 5; i++) {
        var randHeight = 100;
        var randWidth =  30;
        var randZ = 100;
        
        var box = BABYLON.Mesh.CreateBox("box", 1, scene);
        box.scaling.y = randHeight;
        box.scaling.x = randWidth;
        box.scaling.z = randWidth;
       // box.material = mat["grey_wall"];
     
        box.position = new BABYLON.Vector3(i*50,box.scaling.y/2,randZ);
      
        box.checkCollisions = true;
        
       for (var j = 0; j < 10; j++) {
        var clip = BABYLON.Mesh.CreateBox("clip", 0.4, scene);
            clip.position = new BABYLON.Vector3(box.position.x + box.scaling.x/2 , box.scaling.y*(j/9), box.position.z - box.scaling.z/2 + (Math.random()*box.scaling.z));
            clip.material = mat["red"];
        var clip2 = BABYLON.Mesh.CreateBox("clip", 0.4, scene);
            clip2.position = new BABYLON.Vector3(box.position.x - box.scaling.x/2, box.scaling.y*(j/9),box.position.z - box.scaling.z/2 + (Math.random()*box.scaling.z));
            clip2.material = mat["red"];
        var clip3 = BABYLON.Mesh.CreateBox("clip", 0.4, scene);
            clip3.position = new BABYLON.Vector3(box.position.x - box.scaling.x/2 + (Math.random()*box.scaling.x), box.scaling.y*(j/9),box.position.z + box.scaling.z/2);
            clip3.material = mat["red"];
        var clip4 = BABYLON.Mesh.CreateBox("clip", 0.4, scene);
            clip4.position = new BABYLON.Vector3(box.position.x - box.scaling.x/2 + (Math.random()*box.scaling.x), box.scaling.y*(j/9),box.position.z-box.scaling.z/2);
            clip4.material = mat["red"];
       }
       

      AllGameObjects["box"+i.toString()] = box;
    }

    var box = BABYLON.Mesh.CreateBox("box", 6.0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    box.position = new BABYLON.Vector3(-10, 3, 0);   // Using a vector
    box.checkCollisions = true;
    AllGameObjects["box"] = box;
    
    var box2 = BABYLON.Mesh.CreateBox("box_translate", 6.0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    box2.position = new BABYLON.Vector3(-20, 3, 0);   // Using a vector
    box2.checkCollisions = true;
    box2.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
    AllGameObjects["box_translate"] = box2;
    

    /* trunks generation */
    for (var i = 0; i < 10; i++) { 
    var trunk = BABYLON.Mesh.CreateCylinder("trunk", 10, 0.8, 1.5, 30, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
     trunk.position = new BABYLON.Vector3(3*i,5,Math.random() * 10);
    trunk.material = mat["materialTrunk1"];
    trunk.checkCollisions = true;
      AllGameObjects["trunk"+i.toString()] = trunk;
    }
    
    

    // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
    var ground = BABYLON.Mesh.CreateGround('ground1', 2000, 2000, 2, scene);
    ground.material = mat["materialGrass1"];
    ground.checkCollisions = true;
    AllGameObjects["ground"] = ground;
    
    
    /********************** FUNCTIONS *****************************/
    AllGameObjects["f_NewPlayer"] = function(user,info){
    var newplayer = BABYLON.Mesh.CreateSphere('sphere', 16, 2, scene);
     newplayer.position.x = info.game_position.x;
     newplayer.position.y = info.game_position.y;
     newplayer.position.z = info.game_position.z;
     newplayer.material = mat["materialSphere3"];
     newplayer.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
     newplayer.checkCollisions = true;
        
    return newplayer;
    }

    
    /********************** FUNCTIONS *****************************/
     
     return AllGameObjects;

}
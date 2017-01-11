/*global BABYLON,socket,gvars*/
function update(scene, engine, mat, go, cam, lig) {

    /****************************Key Controls************************************************/
    
    var key = {}; //object for multiple key presses
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt) {
        key[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt) {
        key[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    /****************************End Key Controls************************************************/


    scene.registerBeforeRender(function() {
        
        /************ catch key inputs ***************************************/
        
        if (key["+"])
            cam.radius--;

        if (key["-"])
            cam.radius++;
        
        if (key["ArrowLeft"] || key["q"]) {
            gvars["rotY"] = -0.05;
        }
        
        if (key["ArrowRight"] || key["d"]) {
            gvars["rotY"] = 0.05;
        }

        if (!(key["ArrowLeft"] || key["q"] || key["ArrowRight"] || key["d"])) {
            gvars["rotY"] = 0;
        }

        if ((key["ArrowUp"] || key["z"]) && (gvars["dz"] > -0.5)) {
            gvars["dz"] -= 0.01;
        } else if ((key["ArrowUp"] || key["z"]) && (gvars["dz"] < -0.5)) {
            gvars["dz"] = -0.5;
        }

        if ((key["ArrowDown"] || key["s"]) && (gvars["dz"] < 0.5)) {
            gvars["dz"] += 0.01;
        } else if ((key["ArrowDown"] || key["s"]) && (gvars["dz"] > 0.5)) {
            gvars["dz"] = 0.5;
        }
        
        if ((!(key["ArrowDown"] || key["s"])) && (!(key["ArrowUp"] || key["z"]))){
          gvars["dz"] = 0;  
        }

        if (key[" "] && gvars["dy"] < 0.5) {
            gvars["dy"] = 0.1;
        } else if (gvars["dy"] > -1){
            gvars["dy"] -= 0.01;
        }
        
        /************end catch key inputs ***************************************/
        
        
        /***** Move behaviour *****************************************************************/
        
        var InputVector = new BABYLON.Vector3(gvars["dz"] * Math.sin(go["sphere"].rotation.y), gvars["dy"], gvars["dz"] * Math.cos(go["sphere"].rotation.y));
        var RopeVector = new BABYLON.Vector3(gvars["rope_direction"].x / 20, (gvars["rope_direction"].y / 20) +  gvars["jumpFactor"], gvars["rope_direction"].z / 20);
        var MoveVector = new BABYLON.Vector3(0,0,0);

        /* if one rope exist */
        if (go["rope"]) {
            //InputVector = InputVector.scale(0.5);
            go["rope"].dispose();
            go["rope"] = BABYLON.Mesh.CreateLines("rope", [
                go["sphere"].position,
                gvars["rope_target"]
            ], scene);
            go["rope"].color = new BABYLON.Color3(1, 1, 1);
            gvars["rope_distance"] = BABYLON.Vector3.Distance(go["sphere"].position, gvars["rope_target"]);
            gvars["rope_direction"] = (gvars["rope_target"]).subtract(go["sphere"].position);

            if (key["a"]) {
                go["rope"].dispose();
                go["rope"] = null;
                gvars["rope_direction"] = new BABYLON.Vector3(0,0,0);
                go["dy"] = 0.5;
            }
            if (key["u"]){
                go["sphere"].moveWithCollisions(RopeVector); 
            }else{
                
            if (go["sphere"].position.x+InputVector.x <= gvars["rope_target"].x+gvars["rope_distanceMax"] && go["sphere"].position.x+InputVector.x >= gvars["rope_target"].x-gvars["rope_distanceMax"])
                MoveVector.x = InputVector.x;
            if (go["sphere"].position.y+InputVector.y <= gvars["rope_target"].y+gvars["rope_distanceMax"] && go["sphere"].position.y+InputVector.y >= gvars["rope_target"].y-gvars["rope_distanceMax"])
               MoveVector.y = InputVector.y + gvars["dy"]; 
            if (go["sphere"].position.z+InputVector.z <= gvars["rope_target"].z+gvars["rope_distanceMax"] && go["sphere"].position.z+InputVector.z >= gvars["rope_target"].z-gvars["rope_distanceMax"])
                MoveVector.z = InputVector.z;
                
            go["sphere"].moveWithCollisions(MoveVector);  
            }
         go["sphere"].moveWithCollisions(MoveVector);  
            console.log(MoveVector);
            
        }else{
            go["sphere"].moveWithCollisions(InputVector);     
            
        }
        
        go["box_translate"].moveWithCollisions(new BABYLON.Vector3(-0.1,0,0)); 
        
        //rotate
        go["sphere"].rotation.y += gvars["rotY"];
        go["sphere"].rotation.y = go["sphere"].rotation.y % (2 * Math.PI);



    /************************************** ONLINE FUNCTION *********************************************************************************/
            
        //update player position to the server
        socket.emit('update position',{user : gvars["user"], game_position : {x : go["sphere"].position.x,y : go["sphere"].position.y,z : go["sphere"].position.z}});
    
        //waiting and detect player position ...
        socket.on('update player position', function (data) {
            
            if (!go[data.id] && data.id != socket.id){
                 go[data.id] = go["f_NewPlayer"](data.id,data.info);  
            }else if (data.id != socket.id){

                go[data.id].position.x = data.info.game_position.x;
                go[data.id].position.y = data.info.game_position.y;
                go[data.id].position.z = data.info.game_position.z; 
            }
     
        }); 
        
        //waiting and detect disconnect player ...
         socket.on('remove player', function (data) {
             if (go[data.id]){
                go[data.id].dispose();
                go[data.id] = null; 
             }

        }); 
        
        socket.on('disconnect player', function (data) {
            socket.emit('remove db_info',{user : gvars["user"]});
        });
        
        
        
        /**************************************END ONLINE FUNCTION *********************************************************************************/
        
        
        
    });
}
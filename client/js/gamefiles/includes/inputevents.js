 /*global BABYLON,gvars*/
 function inputevents(scene,go){
     
 scene.onPointerDown = function (evt, pickResult) {
        // if the click hits the ground object, we change the impact position
        if (pickResult.hit && pickResult.pickedMesh.name == "clip") {
            
            if (go["rope"]){
                go["rope"].dispose();
            }
           console.log(pickResult)
            gvars["rope_target"] = pickResult.pickedPoint;
            gvars["rope_distanceMax"] = BABYLON.Vector3.Distance(gvars["rope_target"],go["sphere"].position);
            go["rope"] = BABYLON.Mesh.CreateLines("rope", [
            go["sphere"].position,
            gvars["rope_target"]
            ], scene);
            
        //     var scaleFactor;
            
        //     if (evt.button == 0)
        //         scaleFactor = 1.1;
        //   if (evt.button == 2)
        //         scaleFactor = 0.9;
                
        //         if (scaleFactor){
        //             pickResult.pickedMesh.scaling.x *= scaleFactor;
        //             pickResult.pickedMesh.scaling.y *= scaleFactor;
        //             pickResult.pickedMesh.scaling.z *= scaleFactor;
        //         }
        
            
            
           console.log(evt)
        }
    };
}
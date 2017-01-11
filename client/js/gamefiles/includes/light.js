/*global BABYLON*/
function light(scene){
    
   var light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0,1,0), scene); 
   return light;
   
}


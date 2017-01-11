/*global BABYLON*/
function materials(scene){
 
 var AllMaterials = {};
/*********************************** Materials *************************/
    var materialGrass1 = new BABYLON.StandardMaterial("grass1", scene);
    materialGrass1.diffuseTexture = new BABYLON.Texture("js/gamefiles/textures/grass.jpg", scene);
    materialGrass1.diffuseTexture.uScale = 500.0;
    materialGrass1.diffuseTexture.vScale = 500.0;
    AllMaterials["materialGrass1"] = materialGrass1;
    
    var materialTrunk1 = new BABYLON.StandardMaterial("trunk1", scene);
    materialTrunk1.diffuseTexture = new BABYLON.Texture("js/gamefiles/textures/trunk1.png", scene);  
    materialTrunk1.diffuseTexture.uScale = 2.0;
    materialTrunk1.diffuseTexture.vScale = 4.0;
    AllMaterials["materialTrunk1"] = materialTrunk1;
    
    var materialGreyWall = new BABYLON.StandardMaterial("trunk1", scene);
    materialGreyWall.diffuseTexture = new BABYLON.Texture("js/gamefiles/textures/bricks.jpg", scene);  
    //   materialGreyWall.diffuseTexture.uScale = 2.0;
    //   materialGreyWall.diffuseTexture.vScale = 2.0;
    AllMaterials["grey_wall"] = materialGreyWall;
    
    var materialSphere2 = new BABYLON.StandardMaterial("texture2", scene);
    materialSphere2.diffuseColor = new BABYLON.Color3(0, 1, 0);
    AllMaterials["materialSphere2"] =  materialSphere2;
    
     var materialSphere3 = new BABYLON.StandardMaterial("texture", scene);
    materialSphere3.diffuseColor = new BABYLON.Color3(0, 0, 1);
    AllMaterials["materialSphere3"] =  materialSphere3;
    
    
    var red = new BABYLON.StandardMaterial("red", scene);
    red.diffuseColor = new BABYLON.Color3(1.0, 0, 0);
    AllMaterials["red"] =  red;
    

    
    AllMaterials["random"] = function(){
        var RandomColor = new BABYLON.StandardMaterial("texture", scene);
        RandomColor.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        return RandomColor;
    }
    
    
    
    return AllMaterials;

    /*********************************** END Materials *************************/
}
 
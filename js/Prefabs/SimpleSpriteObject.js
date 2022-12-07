var SimpleSpriteObject = function(name)
{
    var instance = new GameObject(name);
    instance.Base = GameObject;

    instance.Name = name ? name : "SimpleSpriteObject" + instance.Id;

    instance.Initialize = SimpleSpriteObject.Initialize;

    return instance;
};

SimpleSpriteObject.Initialize = function()
{
    this.AddComponent(new SpriteComponent("images/MechSonic.png", "js/Animations/MechSonic.json", 8));
    this.Base.Initialize.call(this);
};
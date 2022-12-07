var SimpleSpriteAnimationObject = function(name)
{
    var instance = new GameObject(name);
    instance.Base = GameObject;

    instance.Name = name ? name : "SimpleSpriteAnimationObject" + instance.Id;
    instance.Animation = undefined;

    instance.Initialize = SimpleSpriteAnimationObject.Initialize;
    instance.LoadContent = SimpleSpriteAnimationObject.LoadContent;

    return instance;
};

SimpleSpriteAnimationObject.Initialize = function()
{
    this.Animation = new SpriteAnimationComponent("images/MechSonic.png", "js/Animations/MechSonic.json",
    [
        { Name: "SpinFast", Frames: SpriteAnimationComponent.GenerateFramesObject(0,32), Time: 500, Loop: true },
        { Name: "HalfSpinSlow", Frames: SpriteAnimationComponent.GenerateFramesObject(0,16), Time: 1000, Loop: false },
        { Name: "SpinSlow", Frames: SpriteAnimationComponent.GenerateFramesObject(0,32), Time: 2000, Loop: true }
    ]);
    this.AddComponent(this.Animation);
    this.Base.Initialize.call(this);
};

SimpleSpriteAnimationObject.LoadContent = function()
{
    this.Base.LoadContent.call(this);
    this.Animation.SetAnimationByName("SpinSlow");
};
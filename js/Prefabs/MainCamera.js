var MainCamera = function()
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "MainCamera" + instance.id;
    instance.Initialize = MainCamera.Initialize;
    instance.FollowObject = undefined;
    return instance;
};

MainCamera.Initialize = function()
{
    this.AddComponent(new CameraComponent());
    this.Base.Initialize.call(this);
};
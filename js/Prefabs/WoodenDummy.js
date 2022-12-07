var WoodenDummy = function()
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "WoodenDummy" + instance.Id;
    instance.Initialize = WoodenDummy.Initialize;
    instance.Destroy = WoodenDummy.Destroy;
    instance.OnCollision = WoodenDummy.OnCollision;
    return instance;
};

WoodenDummy.Initialize = function()
{
    this.Base.Initialize.call(this);
    this.AddComponent(new ImageComponent("images/WoodenDummy.png", 0.58, 0.72));
    this.Physics = this.AddComponent(new PhysicsComponent("Circle", 22, 0, 5, 5, 0, true));

    Physics.AddOnCollisionFunction(this, this.OnCollision);
};

WoodenDummy.Destroy = function()
{
    Physics.RemoveOnCollisionFunction(this, this.OnCollision);
    this.Base.Destroy.call(this);
};

WoodenDummy.OnCollision = function(other, impulse)
{
    if (other.Name.indexOf("Sword") > -1)
        this.ScheduleDestroy = true;
};
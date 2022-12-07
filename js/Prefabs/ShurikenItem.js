var ShurikenItem = function()
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "ShurikenItem" + instance.Id;
    instance.Physics = undefined;
    instance.LoadContent = ShurikenItem.LoadContent;
    instance.OnCollision = ShurikenItem.OnCollision;
    return instance;
};

ShurikenItem.LoadContent = function()
{
    this.Base.LoadContent.call(this);
    this.AddComponent(new ImageComponent("images/Shurikens.png"));
    this.Physics = this.AddComponent(new PhysicsComponent("Circle", 50));
    this.Physics.Fixture.SetSensor(true);
    Physics.AddOnCollisionFunction(this, this.OnCollision, "BeginContact");
};

ShurikenItem.OnCollision = function(other)
{
    if (other.Name.indexOf("Ninja") > -1)
    {
        Physics.RemoveOnCollisionFunction(this, this.OnCollision, "BeginContact");
        other.HasShuriken = true;
        this.RemoveComponent(this.GetComponent("ImageComponent"));
        this.RemoveComponent(this.Physics);
        this.Physics.ScheduleDestroy = true;
        this.AddComponent(new ImageComponent("images/MouseImage2.png", 0, 0));
        this.Transform.X -= 50;
        this.Transform.Y -= 82;
    }
};

ShurikenItem.Destroy = function()
{
    this.Base.Destroy.call(this);
};
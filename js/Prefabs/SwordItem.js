var SwordItem = function()
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "SwordItem" + instance.Id;
    instance.Physics = undefined;
    instance.LoadContent = SwordItem.LoadContent;
    instance.OnCollision = SwordItem.OnCollision;
    return instance;
};

SwordItem.LoadContent = function()
{
    this.Base.LoadContent.call(this);
    this.AddComponent(new ImageComponent("images/SwordItem.png"));
    this.Physics = this.AddComponent(new PhysicsComponent("Circle", 25));
    this.Physics.Fixture.SetSensor(true);
    Physics.AddOnCollisionFunction(this, this.OnCollision, "BeginContact");
};

SwordItem.OnCollision = function(other)
{
    if (other.Name.indexOf("Ninja") > -1)
    {
        other.HasSword = true;
        other.FirstTimeSword = true;
        this.ScheduleDestroy = true;
    }
};

SwordItem.Destroy = function()
{
    Physics.RemoveOnCollisionFunction(this, this.OnCollision, "BeginContact");
    this.Base.Destroy.call(this);
};
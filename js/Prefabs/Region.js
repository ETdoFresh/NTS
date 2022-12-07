var Region = function(radius)
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "Region" + instance.Id;
    instance.Radius = radius ? radius : 100;
    instance.Physics = undefined;
    instance.LoadContent = Region.LoadContent;
    instance.OnCollision = Region.OnCollision;
    instance.Destroy = Region.Destroy;
    return instance;
};

Region.LoadContent = function()
{
    this.Base.LoadContent.call(this);
    this.Physics = this.AddComponent(new PhysicsComponent("Circle", this.Radius, 0, 0, 0, 0, false, 0x8, 0xFFFF));
    this.Physics.Fixture.SetSensor(true);

    Physics.AddOnCollisionFunction(this, this.OnCollision, "BeginContact");
};

Region.OnCollision = function (other, impulse)
{
    //console.log("Region Collide with", other.Name);
};

Region.Destroy = function()
{
    Physics.RemoveOnCollisionFunction(this, this.OnCollision, "BeginContact");
};
var Bush = function()
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "Bush" + instance.Id;
    instance.LoadContent = Bush.LoadContent;
    instance.OnCollision = Bush.OnCollision;
    instance.Destroy = Bush.Destroy;
    return instance;
};

Bush.LoadContent = function()
{
    this.Base.LoadContent.call(this);
    this.AddComponent(new ImageComponent("images/Bushes.png"));
    this.Physics = this.AddComponent(new PhysicsComponent("Box", 316, 438, 0, 0, 0, true));

    Physics.AddOnCollisionFunction(this, this.OnCollision);
};

Bush.OnCollision = function(other)
{
    if (other.Name.indexOf("Sword") > -1)
    {
        this.ScheduleDestroy = true;
    }
};

Bush.Destroy = function()
{
    Physics.RemoveOnCollisionFunction(this, this.OnCollision);
    this.Base.Destroy.call(this);
};
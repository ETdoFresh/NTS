var Enemy = function()
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "Enemy" + instance.Id;
    instance.Initialize = Enemy.Initialize;
    instance.Destroy = Enemy.Destroy;
    instance.OnCollision = Enemy.OnCollision;
    instance.Life = 150;
    instance.MaxLife = 150;
    return instance;
};

Enemy.Initialize = function()
{
    this.Base.Initialize.call(this);
    this.AddComponent(new ImageComponent("images/Enemy.png", 0.4, 0.9));
    this.Physics = this.AddComponent(new PhysicsComponent("Circle", 22, 0, 3, 5, 0, false));
    Physics.AddOnCollisionFunction(this, this.OnCollision);
};

Enemy.Destroy = function()
{
    Physics.RemoveOnCollisionFunction(this, this.OnCollision);
    this.Base.Destroy.call(this);
};

Enemy.OnCollision = function(other, impulse)
{
    if (other.Name.indexOf("Sword") > -1 || other.Name.indexOf("Shuriken") > -1 )
    {
        this.Life -= impulse.normalImpulses[0];
        if (this.Life < 0)
            this.ScheduleDestroy = true;
    }
};
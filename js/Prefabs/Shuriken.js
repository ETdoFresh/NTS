var Shuriken = function(owner, impulse)
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "Shuriken" + instance.Id;
    instance.Owner = owner;
    instance.Impulse = impulse >= 0 ? impulse : 7.5;
    instance.TimeToDestory = 1000;
    instance.Initialize = Shuriken.Initialize;
    instance.Update = Shuriken.Update;
    instance.Destroy = Shuriken.Destroy;
    instance.OnCollision = Shuriken.OnCollision;
    return instance;
};

Shuriken.Initialize = function()
{
    var owner = this.Owner;
    this.AddComponent(new ImageComponent("images/Shuriken.png"));
    var physics = this.AddComponent(new PhysicsComponent("Circle", 10, 0, 1, 0, 0.8, null, 0x4, 0xFFF9));

    this.Base.Initialize.call(this);

    physics.Body.SetBullet(true);
    physics.MoveToPosition(owner.Transform.X, owner.Transform.Y);

    var position = new b2Vec2(owner.Transform.X, owner.Transform.Y);
    position.Multiply(1 / Physics.Scale);

    var impulse = new b2Vec2(Mouse.GameX, Mouse.GameY);
    impulse.Multiply(1 / Physics.Scale);
    impulse.Subtract(new b2Vec2(owner.Physics.BodyX, owner.Physics.BodyY));
    impulse.Normalize();
    impulse.Multiply(this.Impulse);
    physics.Body.ApplyImpulse(impulse, position);

    var ownerVelocity = owner.Physics.Body.GetLinearVelocity();
    var shurikenVelocity = physics.Body.GetLinearVelocity();
    physics.Body.SetLinearVelocity(new b2Vec2(ownerVelocity.x + shurikenVelocity.x,
        ownerVelocity.y + shurikenVelocity.y));

    var max = 100;
    var min = 80;
    var random = Math.random() > 0.5 ? Math.random() * (max - min) + min : -(Math.random() * (max - min) + min);
    physics.Body.ApplyTorque(random);
    var that = this;
    this.Timeout = setTimeout(function() { if (that) that.Destroy(); }, this.TimeToDestory);

    Physics.AddOnCollisionFunction(this, this.OnCollision);
};

Shuriken.Update = function(gameTime)
{
    this.Transform.Rotation = this.GetComponent("PhysicsComponent").BodyAngle;
    this.Base.Update.call(this, gameTime);
};

Shuriken.Destroy = function()
{
    Physics.RemoveOnCollisionFunction(this, this.OnCollision);
    if (this.Timeout) clearTimeout(this.Timeout);
    this.Base.Destroy.call(this);
};

Shuriken.OnCollision = function(other, impulse)
{
    //console.log("Shuriken Collision!", other.Name, impulse.normalImpulses[0]);
};
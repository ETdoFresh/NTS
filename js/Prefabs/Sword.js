var Sword = function(owner)
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "Sword" + instance.Id;
    instance.Owner = owner;
    instance.Depth = 0;
    instance.Initialize = Sword.Initialize;
    instance.Update = Sword.Update;
    instance.OnCollision = Sword.OnCollision;
    instance.Toggle = 1;
    return instance;
};

Sword.Initialize = function()
{
    this.Base.Initialize.call(this);

    this.AddComponent(new ImageComponent("images/Sword.png"));
    var physics = this.AddComponent(
        new PhysicsComponent("Box", 2.5 * Physics.Scale, 0.4 * Physics.Scale, 20, 0, 0.8, false, 0x4, 0xFFF9));
    physics.Body.SetBullet(true);
    physics.MoveToPosition(this.Owner.Transform.X, this.Owner.Transform.Y);
    Physics.AddOnCollisionFunction(this, this.OnCollision);

    var steering = this.AddComponent(new SteeringComponent("ImmediateFace"));
};

Sword.Update = function(gameTime)
{
    var angle = Math.atan2(-(Mouse.GameX - this.Owner.Transform.X), Mouse.GameY - this.Owner.Transform.Y)+ Math.PI / 2;
    this.Transform.Rotation = angle + Math.PI / 2;
    var x = this.Owner.Transform.X + 50 * Math.cos(angle);
    var y = this.Owner.Transform.Y + 50 * Math.sin(angle);
    var physics = this.GetComponent("PhysicsComponent");
    physics.MoveToPosition(x, y);
    this.Base.Update.call(this, gameTime);
};

Sword.OnCollision = function (other, impulse)
{
    //console.log("Sword Collision!", other.Name, impulse.normalImpulses[0]);
};
var Ninja = function(name)
{
    var instance = new GameObject(name);
    instance.Base = GameObject;
    instance.Name = name ? name : "Ninja" + instance.Id;
    instance.Animation = undefined;
    instance.Initialize = Ninja.Initialize;
    instance.Update = Ninja.Update;
    instance.Direcitons = undefined;
    instance.HasShuriken = false;
    instance.HasSword = false;
    return instance;
};

Ninja.Initialize = function()
{
    this.Animation = new SpriteAnimationComponent("images/test.png", "images/test.json",
    [
        { Name: "Stand0", Frames: [8], Time: 10000, Loop: false },
        { Name: "Stand1", Frames: [0], Time: 10000, Loop: false },
        { Name: "Stand2", Frames: [4], Time: 10000, Loop: false },
        { Name: "Stand3", Frames: [12], Time: 10000, Loop: false },
        { Name: "Walk0", Frames: [8,9,10,11], Time: 500, Loop: true },
        { Name: "Walk1", Frames: [0,1,2,3], Time: 500, Loop: true },
        { Name: "Walk2", Frames: [4,5,6,7], Time: 500, Loop: true },
        { Name: "Walk3", Frames: [12,13,14,15], Time: 500, Loop: true }
    ]);
    this.AddComponent(this.Animation);
    this.Animation.AnchorY = 0.75;
    this.Direcitons = 4;
    this.Physics = this.AddComponent(new PhysicsComponent("Circle", 12, 12, 1, 1, null, null, 0x2, 0xFFFB));
    this.Steering = this.AddComponent(new SteeringComponent());
    this.Steering.Target = Game.Scene.GetChildByName("Crosshair").Transform;
    this.Steering.SteeringType = "Arrive";

    // TODO Delete these lines when done testing!
//    this.Steering.MaxVelocity = 30;
//    this.Steering.MaxAcceleration = 500;

    var lookSteering = this.AddComponent(new SteeringComponent());
    lookSteering.Target = this.Steering.Target;
    lookSteering.SteeringType = "LookTowardsMovement";
    this.Base.Initialize.call(this);
};

Ninja.Update = function(gameTime)
{
    var velocity = this.Physics.Body.GetLinearVelocity();
    var action = velocity.Length() > 0.5 ? "Walk" : "Stand";

    var offset = 2 * Math.PI / this.Direcitons / 2;
    var newDirection = Math.floor(WrapRadian(this.Physics.BodyAngle + offset) / (2 * Math.PI) * this.Direcitons);
    this.Animation.SetAnimationByName(action + newDirection);

    var position = new b2Vec2(this.Transform.X, this.Transform.Y);
    var distance = new b2Vec2(Mouse.GameX, Mouse.GameY);
    distance.Subtract(position);

    if (this.FirstTimeSword)
        if (!this.Sword)
        {
            this.Sword = this.Parent.AddChild(new Sword(this));
            this.FirstTimeSword = false;
        }

    if (Mouse.RightButtonPressed && distance.Length() < 30 && this.HasSword)
    {
        if (!this.Sword)
            this.Sword = this.Parent.AddChild(new Sword(this));
        else if (this.Sword && this.Sword.Destroy)
        {
            this.Sword.Destroy();
            this.Sword = null;
        }

        Mouse.RightButtonPressed = false;
    }
    else if (Mouse.RightButtonPressed && this.HasShuriken)
    {
        this.Parent.AddChild(new Shuriken(this));
        Mouse.RightButtonPressed = false;
    }

    this.Base.Update.call(this, gameTime);
};

function WrapRadian(rad)
{
    if (rad < 0)
        return WrapRadian(rad + 2 * Math.PI);
    if (rad >= 2 * Math.PI)
        return WrapRadian(rad - 2 * Math.PI);

    return rad;
};
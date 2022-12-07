var FollowMouseComponent = function ()
{
    var instance = GameComponent();
    instance.Base = GameComponent;
    instance.Type = "FollowMouseComponent";

    instance.Update = FollowMouseComponent.Update;

    return instance;
};

FollowMouseComponent.Update = function(gameTime)
{
    if (Mouse.ButtonPressed)
    {
        if (this.GameObject.Physics)
        {
            //this.GameObject.Physics.MoveToPosition(Mouse.GameX, Mouse.GameY);
            var physics = this.GameObject.Physics;
            var body = this.GameObject.Physics.Body;
            var x = body.GetPosition().x;
            var y = body.GetPosition().y;
            var force = 100;
            var dv = new b2Vec2(Mouse.GameX / Physics.Scale - x, Mouse.GameY / Physics.Scale - y);
            dv.Normalize();
            dv.Multiply(force);
            body.ApplyForce(dv,
                new b2Vec2(physics.BodyX, physics.BodyY));
        }
        else
        {
            this.GameObject.Transform.X = Mouse.GameX;
            this.GameObject.Transform.Y = Mouse.GameY;
        }
    }
    this.Base.Update.call(this, gameTime);
};
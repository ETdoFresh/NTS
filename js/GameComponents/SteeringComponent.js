var SteeringComponent = function(type)
{
    var instance = new GameComponent();
    instance.Base = GameComponent;
    instance.Type = "SteeringComponent";
    instance.Transform = undefined;
    instance.Physics = undefined;

    instance.Target = undefined;
    instance.PrevSteeringType = undefined;
    instance.SteeringType = type ? type : "Seek"; // Seek, Flee, Arrive, Pursue, Evade,
    instance.SteeringFunction = undefined;
    instance.MaxVelocity = 8;
    instance.MaxAngularVelocity = 20;
    instance.MaxAcceleration = 50;
    instance.MaxAngularAcceleration = 200;

    instance.Initialize = SteeringComponent.Initialize;
    instance.Update = SteeringComponent.PreUpdate;
    instance.DetectSteeringTypeChange = SteeringComponent.DetectSteeringTypeChange;
    instance.LimitVelocity = SteeringComponent.LimitVelocity;
    instance.Stop = SteeringComponent.Stop;
    instance.StopRotation = SteeringComponent.StopRotation;

    return instance;
};

SteeringComponent.Initialize = function()
{
    this.Base.Initialize.call(this);
    this.Physics = this.GameObject.GetComponent("PhysicsComponent");
    this.Transform = this.GameObject.GetComponent("TransformComponent");

    if (this.Transform && this.Physics)
        this.Update = SteeringComponent.Update;
};

SteeringComponent.PreUpdate = function(gameTime)
{
    if (!this.Transform)
        this.Transform = this.GameObject.GetComponent("TransformComponent");

    if (!this.Physics)
        this.Physics = this.GameObject.GetComponent("PhysicsComponent");

    if (this.Transform && this.Physics)
        this.Update = SteeringComponent.Update;

    this.Base.Update.call(this, gameTime);
};

SteeringComponent.Update = function(gameTime)
{
    this.DetectSteeringTypeChange();

    if (this.SteeringFunction)
        this.SteeringFunction(gameTime);

    this.Base.Update.call(this, gameTime);
};

SteeringComponent.DetectSteeringTypeChange = function()
{
    if (this.PrevSteeringType != this.SteeringType)
    {
        this.PrevSteeringType = this.SteeringType;
        switch (this.SteeringType)
        {
            case "Seek":
                this.SteeringFunction = SteeringComponent.Seek;
                break;
            case "Flee":
                this.SteeringFunction = SteeringComponent.Flee;
                break;
            case "Arrive":
                this.SteeringFunction = SteeringComponent.Arrive;
                break;
            case "Align":
                this.SteeringFunction = SteeringComponent.Align;
                break;
            case "LookTowardsMovement":
                this.SteeringFunction = SteeringComponent.LookTowardsMovement;
                break;
            case "Face":
                this.SteeringFunction = SteeringComponent.Face;
                break;
            case "ImmediateFace":
                this.SteeringFunction = SteeringComponent.ImmediateFace;
                break;
        }
    }
};

SteeringComponent.LimitVelocity = function(gameTime)
{
    var velocity = this.Physics.Body.GetLinearVelocity();
    var originalVelocity = velocity.Length();
    var fps = 1000 / gameTime.DeltaTime;
    if (velocity.Length() > this.MaxVelocity)
    {
        velocity.Normalize();
        velocity.Multiply(this.MaxVelocity);
        velocity.Subtract(originalVelocity);
        velocity.Multiply(1 / (1 / fps));
        this.Physics.Body.ApplyForce(velocity, this.Physics);
    }
    var test2 = velocity.Length();
    console.log ("Before and after velocity: ", originalVelocity, test2);
};

SteeringComponent.Seek = function(gameTime)
{
    var fps = 1000 / gameTime.DeltaTime;
    var source = new b2Vec2(this.Physics.BodyX, this.Physics.BodyY);
    var target = new b2Vec2(this.Target.X / Physics.Scale, this.Target.Y / Physics.Scale);
    var velocity = this.Physics.Body.GetLinearVelocity();

    var desiredVelocity = target.Copy();
    desiredVelocity.Subtract(source);
    desiredVelocity.Multiply(1 / (1 / fps));
    if (desiredVelocity.Length() > this.MaxVelocity)
    {
        desiredVelocity.Normalize();
        desiredVelocity.Multiply(this.MaxVelocity);
    }

    var desiredAcceleration = desiredVelocity.Copy();
    desiredAcceleration.Subtract(velocity);
    desiredAcceleration.Multiply(1 / (1 / fps));
    if (desiredAcceleration.Length() > this.MaxAcceleration)
    {
        desiredAcceleration.Normalize();
        desiredAcceleration.Multiply(this.MaxAcceleration);
    }

    var force = desiredAcceleration.Copy();
    force.Multiply(this.Physics.BodyMass);

    this.Physics.Body.ApplyForce(force, source);
};

SteeringComponent.Flee = function(gameTime)
{
    var fps = 1000 / gameTime.DeltaTime;
    var source = new b2Vec2(this.Physics.BodyX, this.Physics.BodyY);
    var target = new b2Vec2(this.Target.X / Physics.Scale, this.Target.Y / Physics.Scale);
    var velocity = this.Physics.Body.GetLinearVelocity();

    var desiredVelocity = source.Copy();
    desiredVelocity.Subtract(target);
    desiredVelocity.Multiply(1 / (1 / fps));
    if (desiredVelocity.Length() > this.MaxVelocity)
    {
        desiredVelocity.Normalize();
        desiredVelocity.Multiply(this.MaxVelocity);
    }

    var desiredAcceleration = desiredVelocity.Copy();
    desiredAcceleration.Subtract(velocity);
    desiredAcceleration.Multiply(1 / (1 / fps));
    if (desiredAcceleration.Length() > this.MaxAcceleration)
    {
        desiredAcceleration.Normalize();
        desiredAcceleration.Multiply(this.MaxAcceleration);
    }

    var force = desiredAcceleration.Copy();
    force.Multiply(this.Physics.BodyMass);

    this.Physics.Body.ApplyForce(force, source);
};

SteeringComponent.Arrive = function(gameTime)
{
    var source = new b2Vec2(this.Physics.BodyX, this.Physics.BodyY);
    var target = new b2Vec2(this.Target.X / Physics.Scale, this.Target.Y / Physics.Scale);
    var velocity = this.Physics.Body.GetLinearVelocity();
    var timeToTarget = this.MaxVelocity / this.MaxAcceleration; // * this.Physics.BodyMass / this.Physics.BodyMass
    var slowRadius = this.MaxVelocity * timeToTarget * 1.5;
    var deltaPosition = target.Copy();
    deltaPosition.Subtract(source);
    var distance = deltaPosition.Length();

    var desiredVelocity = deltaPosition.Copy();
    desiredVelocity.Normalize();
    if (distance < 0.1)
        return this.Stop();
    else if (distance < slowRadius)
        desiredVelocity.Multiply(distance / slowRadius * this.MaxVelocity);
    else
        desiredVelocity.Multiply(this.MaxVelocity);

    var desiredAcceleration = desiredVelocity.Copy();
    desiredAcceleration.Subtract(velocity);
    desiredAcceleration.Multiply(1 / timeToTarget);
    if (desiredAcceleration.Length() > this.MaxAcceleration)
    {
        desiredAcceleration.Normalize();
        desiredAcceleration.Multiply(this.MaxAcceleration);
    }

    var force = desiredAcceleration.Copy();
    force.Multiply(this.Physics.BodyMass);

    this.Physics.Body.ApplyForce(force, source);
};

SteeringComponent.Align = function(gameTime)
{
    var source = this.Physics.BodyAngle;
    var target = this.Target.Rotation;
    var angularVelocity = this.Physics.Body.GetAngularVelocity();
    var timeToTarget = this.MaxAngularVelocity / this.MaxAngularAcceleration;
    var slowRadius = this.MaxAngularVelocity * timeToTarget;
    var deltaRotation = target - source;

    while (deltaRotation < -Math.PI) deltaRotation += 2 * Math.PI;
    while (deltaRotation > Math.PI) deltaRotation -= 2 * Math.PI;

    var distance = Math.abs(deltaRotation);

    var desiredAngularVelocity = deltaRotation / distance;
    if (distance < 0.1)
        return this.StopRotation();
    else if (distance < slowRadius)
        desiredAngularVelocity *= distance / slowRadius * this.MaxAngularVelocity;
    else
        desiredAngularVelocity *= this.MaxAngularVelocity;

    var desiredAcceleration = (desiredAngularVelocity - angularVelocity) / timeToTarget;
    if (Math.abs(desiredAcceleration) > this.MaxAngularAcceleration)
    {
        desiredAcceleration = desiredAcceleration / Math.abs(desiredAcceleration);
        desiredAcceleration *= this.MaxAngularAcceleration;
    }

    var torque = desiredAcceleration * this.Physics.Body.GetInertia();

    this.Physics.Body.ApplyTorque(torque);

};

SteeringComponent.LookTowardsMovement = function(gameTime)
{
    this.Target.Rotation = Math.atan2(-this.Physics.BodyVelocityX, this.Physics.BodyVelocityY) + Math.PI / 2;
    if (this.Physics.Body.GetLinearVelocity().Length() > 0)
        SteeringComponent.Align.call(this, gameTime);
};

SteeringComponent.Face = function(gameTime)
{
    if (!this.Target) this.Target = {};

    this.Target.Rotation = Math.atan2(-(Mouse.GameX - this.GameObject.Transform.X),
            Mouse.GameY - this.GameObject.Transform.Y) + Math.PI / 2;
    SteeringComponent.Align.call(this, gameTime);
};

SteeringComponent.ImmediateFace = function(gameTime)
{
    var fps = 1000 / gameTime.DeltaTime;
    var source = this.Physics.BodyAngle;
    var angularVelocity = this.Physics.Body.GetAngularVelocity();
    var target = this.Target ? this.Target : {} ;
    target.Rotation = Math.atan2(-(Mouse.GameX - this.GameObject.Transform.X),
            Mouse.GameY - this.GameObject.Transform.Y) + Math.PI / 2;
    var nextAngle = source + angularVelocity / fps;
    var deltaRotation = target.Rotation - nextAngle;

    while (deltaRotation < -Math.PI) deltaRotation += 2 * Math.PI;
    while (deltaRotation > Math.PI) deltaRotation -= 2 * Math.PI;
    var desiredAngularVelocity = deltaRotation * fps;
    var torque = this.Physics.Body.GetInertia() * desiredAngularVelocity / (1 / fps);

    this.Physics.Body.ApplyTorque(torque);
};

SteeringComponent.Stop = function()
{
    if (this.Physics.Body.GetLinearVelocity().Length() > 0)
        this.Physics.Body.SetLinearVelocity(new b2Vec2(0,0));
};

SteeringComponent.StopRotation = function()
{
    if (this.Physics.Body.GetAngularVelocity() > 0)
        this.Physics.Body.SetAngularVelocity(0);
};
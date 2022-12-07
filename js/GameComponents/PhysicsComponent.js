var PhysicsComponent = function(shape, widthOrRadiusOrShape, height, density, friction, restitution, isStatic, categoryBits, maskBits)
{
    var instance =  new GameComponent();
    instance.Base = GameComponent;
    instance.Type = "PhysicsComponent";

    instance.Shape = shape ? shape : "Box";

    if (instance.Shape == "Circle")
        instance.Radius = widthOrRadiusOrShape ? widthOrRadiusOrShape : 11;
    else if (instance.Shape == "Custom")
        instance.Vertices = widthOrRadiusOrShape;
    else
    {
        instance.Width = widthOrRadiusOrShape ? widthOrRadiusOrShape : 11;
        instance.Height = height >= 0 ? height : 11;
    }
    instance.Density = density ? density : 1.0;
    instance.Friction = friction >= 0 ? friction : 0.5;
    instance.Restitution = restitution >= 0 ? restitution : 0.2;
    instance.IsStatic = isStatic? true : false;
    instance.Body = undefined;
    instance.Fixture = undefined;
    instance.Initialize = PhysicsComponent.Initialize;
    instance.Update = PhysicsComponent.Update;
    instance.MoveToPosition = PhysicsComponent.MoveToPosition;
    instance.Destroy = PhysicsComponent.Destroy;

    instance.BodyX = undefined;
    instance.BodyY = undefined;
    instance.BodyAngle = undefined;
    instance.BodyMass = undefined;
    instance.BodyVelocityX = undefined;
    instance.BodyVelocityY = undefined;
    instance.BodyAngleVelocity = undefined;

    instance.FixtureCategoryBits = categoryBits ? categoryBits : 0x0001;
    instance.FixtureMaskBits = maskBits ? maskBits : 0xFFFF;

    return instance;
};

PhysicsComponent.Initialize = function()
{
    this.Base.Initialize.call(this);

    var fixDef = new b2FixtureDef;
    fixDef.density = this.Density;
    fixDef.friction = this.Friction;
    fixDef.restitution = this.Restitution;
    fixDef.filter.categoryBits = this.FixtureCategoryBits;
    fixDef.filter.maskBits = this.FixtureMaskBits;

    if (this.Shape == "Circle")
        fixDef.shape = new b2CircleShape(this.Radius / Physics.Scale);
    else if (this.Shape == "Custom")
    {
        var vertices = [];
        for (var i = 0; i < this.Vertices.length; i = i + 2)
            vertices.push(new b2Vec2(this.Vertices[i] / Physics.Scale , this.Vertices[i+1] / Physics.Scale));

        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsArray(vertices, vertices.length);
    }
    else
    {
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(this.Width / 2 / Physics.Scale, this.Height / 2 / Physics.Scale);
    }

    var bodyDef = new b2BodyDef;
    bodyDef.type = this.IsStatic? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
    bodyDef.userData = this.GameObject;
    this.Body = Physics.World.CreateBody(bodyDef);
    this.Fixture = this.Body.CreateFixture(fixDef);

    this.Body.SetLinearDamping(this.Friction * 2);
    this.Body.SetAngularDamping(this.Friction);
};

PhysicsComponent.Update = function(gameTime)
{
    this.Base.Update.call(this, gameTime);

    this.GameObject.Transform.X = this.Body.GetPosition().x * Physics.Scale;
    this.GameObject.Transform.Y = this.Body.GetPosition().y * Physics.Scale;

    this.BodyX = this.Body.GetPosition().x;
    this.BodyY = this.Body.GetPosition().y;
    this.BodyAngle = this.Body.GetAngle();
    this.BodyMass = this.Body.GetMass();
    this.BodyVelocityX = this.Body.GetLinearVelocity().x;
    this.BodyVelocityY = this.Body.GetLinearVelocity().y;
    this.BodyAngleVelocity = this.Body.GetAngularVelocity();
};

PhysicsComponent.MoveToPosition = function(x, y)
{
    this.Body.SetPosition(new b2Vec2(x / Physics.Scale, y / Physics.Scale));
};

PhysicsComponent.Destroy = function()
{
    Physics.World.DestroyBody(this.Body);
    this.Base.Destroy.call(this);
}
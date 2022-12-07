var Physics =
{
    Enabled: false,
    Visible: false,
    Scale: 30,
    World: undefined,
    OnCollisionObjects: [],
    OnCollisionFunctions: [],
    OnCollisionTypes: [],

    Initialize: function()
    {
        var gravity = new b2Vec2(0, 0);
        var allowSleep = true;
        Physics.World = new b2World(gravity, allowSleep);

        Physics.Enabled = true;
        Physics.Visible = false;

        //setup debug draw
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(Game.Context);
        debugDraw.SetDrawScale(Physics.Scale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        Physics.World.SetDebugDraw(debugDraw);

        var listener = new b2Listener();
        listener.PostSolve = Physics.PostSolveFunctions;
        listener.BeginContact = Physics.BeginContactFunctions;
        Physics.World.SetContactListener(listener);
    },

    Update: function(gameTime)
    {
        if (Physics.Enabled)
        {
            var frameRate = gameTime.DeltaTime / 1000;
            var velocityIterations = 10;
            var positionIterations = 10;
            Physics.World.Step(frameRate, velocityIterations, positionIterations);
            Physics.World.ClearForces();
        }
    },

    Draw: function(context, gameTime)
    {
        if (Physics.Visible)
        {
            if (Game.Scene)
            {
                context.save();
                context.translate(Game.Scene.Transform.X, Game.Scene.Transform.Y);
            }

            Physics.World.DrawDebugData();
{
            if (Game.Scene)
                context.restore();}
        }
    },

    AddOnCollisionFunction: function(thisObject, onCollisionFunction, type)
    {
        type = type || "PostSolve";
        if (thisObject && onCollisionFunction)
        {
            Physics.OnCollisionObjects.push(thisObject);
            Physics.OnCollisionFunctions.push(onCollisionFunction);
            Physics.OnCollisionTypes.push(type);
        }
    },

    RemoveOnCollisionFunction: function(thisObject, onCollisionFunction, type)
    {
        type = type || "PostSolve";
        for (var i = 0; i < Physics.OnCollisionFunctions.length; i++)
        {
            if (Physics.OnCollisionFunctions[i] == onCollisionFunction)
            {
                if (Physics.OnCollisionObjects[i] == thisObject)
                {
                    Physics.OnCollisionFunctions.splice(i, 1);
                    Physics.OnCollisionObjects.splice(i, 1);
                    Physics.OnCollisionTypes.splice(i, 1);
                    return;
                }
            }
        }
    },

    PostSolveFunctions: function(contact, impulse)
    {
        var objectA = contact.GetFixtureA().GetBody().GetUserData();
        var objectB = contact.GetFixtureB().GetBody().GetUserData();

        for (var i = 0; i < Physics.OnCollisionObjects.length; i++)
        {
            if (Physics.OnCollisionTypes[i] == "PostSolve")
            {
                var forObject = Physics.OnCollisionObjects[i];
                if (forObject == objectA)
                {
                    Physics.OnCollisionFunctions[i].call(objectA, objectB, impulse);
                    if (Game.Scene.Trigger) Game.Scene.Trigger.MarkCondition("Collide", objectB, objectA);
                    if (Game.Scene.Trigger) Game.Scene.Trigger.MarkCondition("Collide", objectA, objectB);
                }
                else if (forObject == objectB)
                {
                    Physics.OnCollisionFunctions[i].call(objectB, objectA, impulse);
                    if (Game.Scene.Trigger) Game.Scene.Trigger.MarkCondition("Collide", objectB, objectA);
                    if (Game.Scene.Trigger) Game.Scene.Trigger.MarkCondition("Collide", objectA, objectB);
                }
            }
        }
    },

    BeginContactFunctions: function(contact, impulse)
    {
        var objectA = contact.GetFixtureA().GetBody().GetUserData();
        var objectB = contact.GetFixtureB().GetBody().GetUserData();

        for (var i = 0; i < Physics.OnCollisionObjects.length; i++)
        {
            if (Physics.OnCollisionTypes[i] == "BeginContact")
            {
                var forObject = Physics.OnCollisionObjects[i];
                if (forObject == objectA)
                {
                    Physics.OnCollisionFunctions[i].call(objectA, objectB, impulse);
                    if (Game.Scene.Trigger) Game.Scene.Trigger.MarkCondition("Collide", objectB, objectA);
                    if (Game.Scene.Trigger) Game.Scene.Trigger.MarkCondition("Collide", objectA, objectB);
                }
                else if (forObject == objectB)
                {
                    Physics.OnCollisionFunctions[i].call(objectB, objectA, impulse);
                    if (Game.Scene.Trigger) Game.Scene.Trigger.MarkCondition("Collide", objectB, objectA);
                    if (Game.Scene.Trigger) Game.Scene.Trigger.MarkCondition("Collide", objectA, objectB);
                }
            }
        }
    },

    ResetOnCollisionFunctions: function()
    {
        Physics.OnCollisionFunctions = [];
        Physics.OnCollisionObjects = [];
        Physics.OnCollisionTypes = [];
    }
};

// Common Box2D Variables (for easy reference)
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FilterData = Box2D.Dynamics.b2FilterData;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
var b2RevoluteJointDef  = Box2D.Dynamics.Joints.b2RevoluteJointDef ;
var b2Listener = Box2D.Dynamics.b2ContactListener;
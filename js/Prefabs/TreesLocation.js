var TreesLocation = function(imageFilename)
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "TreesLocation" + instance.Id;
    instance.ImageFilename = imageFilename ? imageFilename : undefined;
    instance.PhysicsArray = [];
    instance.LoadContent = TreesLocation.LoadContent;
    return instance;
};

TreesLocation.LoadContent = function()
{
    this.Base.LoadContent.call(this);

    var physicsData = JSONLoader.Load("js/Scenes/Physics0.json");

    var i;
    for (i = 0; i < physicsData[0].length; i++)
        this.PhysicsArray.push(this.AddComponent(
            new PhysicsComponent("Custom", physicsData[0][i].shape, null, null, null, null, true)));

    var numberOfTrees = 1000;
    var tree;
    while (numberOfTrees > 0)
    {
        var point, goodPoint;
        while (!goodPoint)
        {
            point = new b2Vec2(RandomInt(0, Game.Scene.MapLoader.MapWidth) / Physics.Scale,
                RandomInt(0, Game.Scene.MapLoader.MapHeight) / Physics.Scale);
            for (i in this.PhysicsArray)
            {
                var fixture = this.PhysicsArray[i].Fixture;
                if (fixture.TestPoint(point))
                {
                    goodPoint = point;
                    break;
                }
            }
        }
        tree = Game.Scene.AddChild(new Tree());
        tree.Transform.X = goodPoint.x * Physics.Scale;
        tree.Transform.Y = goodPoint.y * Physics.Scale;
        goodPoint = null;
        numberOfTrees--;
    }
};
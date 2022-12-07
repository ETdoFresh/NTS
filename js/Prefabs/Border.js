var Border = function(startX, startY, mapWidth, mapHeight)
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "Border" + instance.Id;
    instance.StartX = startX ? startX : 0;
    instance.StartY = startY ? startY : 0;
    instance.MapWidth = mapWidth ? mapWidth : Game.Width ? Game.Width : 0;
    instance.MapHeight = mapHeight ? mapHeight : Game.Height ? Game.Height : 0;
    instance.Size = 30;

    instance.Initialize = Border.Initialize;
    return instance;
};

Border.Initialize = function()
{
    var size = this.Size;
    var mapWidth = this.MapWidth;
    var mapHeight = this.MapHeight;

    var leftBorder = this.AddComponent(new PhysicsComponent("Box", size, mapHeight, null, null, null, true));
    var rightBorder = this.AddComponent(new PhysicsComponent("Box", size, mapHeight, null, null, null, true));
    var topBorder = this.AddComponent(new PhysicsComponent("Box", mapWidth + 2 * size, size, null, null, null, true));
    var bottomBorder = this.AddComponent(new PhysicsComponent("Box", mapWidth + 2 * size, size, null, null, null, true));

    // Must initialize all components before moving
    this.Base.Initialize.call(this);

    leftBorder.MoveToPosition(0 - size / 2, mapHeight / 2);
    rightBorder.MoveToPosition(mapWidth + size / 2, mapHeight / 2);
    topBorder.MoveToPosition(mapWidth / 2, 0 - size / 2);
    bottomBorder.MoveToPosition(mapWidth / 2, mapHeight + size / 2);
};
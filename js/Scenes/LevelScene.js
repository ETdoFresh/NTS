var LevelScene = function(name, levelNumber)
{
    var instance = new GameObject(name);
    instance.Base = GameObject;

    instance.Type = "Scene";
    instance.LevelNumber = levelNumber;
    instance.MapLoader = undefined;
    instance.Camera = undefined;
    instance.Physics = undefined;
    instance.Trigger = undefined;
    instance.Crosshair = undefined;
    instance.Objective = 0;

    instance.Initialize = LevelScene.Initialize;
    instance.LoadContent = LevelScene.LoadContent;
    instance.Update = LevelScene.Update;
    instance.Draw = LevelScene.Draw;
    instance.LevelObjectToGameObject = LevelScene.LevelObjectToGameObject;

    return instance;
};

LevelScene.LevelObjectToGameObject = function(levelObject)
{
    var gameObject;
    switch (levelObject.Type)
    {
        case "SimpleImage":
            gameObject = new SimpleImageObject();
            break;
        case "SimpleSprite":
            gameObject = new SimpleSpriteObject();
            break;
        case "SimpleSpriteAnimation":
            gameObject = new SimpleSpriteAnimationObject();
            break;
        case "GrassBackground":
            var repeatX = Math.ceil(this.MapLoader.MapWidth / 1920);
            var repeatY = Math.ceil(this.MapLoader.MapHeight / 1920);
            gameObject = new GrassBackground(repeatX, repeatY);
            break;
        case "MainCamera":
            gameObject = new MainCamera();
            this.Camera = gameObject;
            break;
        case "Ninja":
            gameObject = new Ninja();
            break;
        case "WoodenDummy":
            gameObject = new WoodenDummy();
            break;
        case "TreesLocation":
            gameObject = new TreesLocation(levelObject.Image);
            break;
        case "Region":
            gameObject = new Region(levelObject.Radius);
            break;
        case "ShurikenItem":
            gameObject = new ShurikenItem();
            break;
        case "SwordItem":
            gameObject = new SwordItem();
            break;
        case "Bush":
            gameObject = new Bush();
            break;
        case "Enemy":
            gameObject = new Enemy();
            break;
    }

    if (gameObject)
    {
        gameObject.Initialize();
        gameObject.JsonId = levelObject.Id;
        gameObject.Transform.X = levelObject.X ? levelObject.X : 0;
        gameObject.Transform.Y = levelObject.Y ? levelObject.Y : 0;
        gameObject.Transform.Rotation = levelObject.Rotation ? levelObject.Rotation : 0;
        gameObject.Transform.ScaleX = levelObject.ScaleX ? levelObject.ScaleX : 1;
        gameObject.Transform.ScaleY = levelObject.ScaleY ? levelObject.ScaleY : 1;

        if (gameObject.Physics)
            gameObject.Physics.MoveToPosition(gameObject.Transform.X, gameObject.Transform.Y);

        if (gameObject.Name.indexOf("Ninja") > -1)
        {
            this.Crosshair.Transform.X = gameObject.Transform.X;
            this.Crosshair.Transform.Y = gameObject.Transform.Y;
        }
    }

    return gameObject;
};

LevelScene.Initialize = function()
{
    var levelNumber = this.LevelNumber;
    if (levelNumber >= 0)
    {
        this.MapLoader = new MapLoaderComponent();
        this.MapLoader.LevelNumber = levelNumber;
        this.AddComponent(this.MapLoader);
        this.Crosshair = this.AddChild(new Crosshair());

        this.Base.Initialize.call(this);
    }
    else
    {
        console.log("Cannot initialize level without a correct levelNumber specified");
    }
};

LevelScene.LoadContent = function()
{
    this.Base.LoadContent.call(this);

    for (var levelObjectIndex in this.MapLoader.GameObjects)
    {
        if (this.MapLoader.GameObjects.hasOwnProperty(levelObjectIndex))
        {
            var levelObject = this.MapLoader.GameObjects[levelObjectIndex];
            var gameObject = this.LevelObjectToGameObject(levelObject);
            if (gameObject)
                this.AddChild(gameObject);
        }
    }
    this.Trigger = this.AddComponent(new TriggerComponent(this.MapLoader.Triggers));

    this.AddChild(new Border(0, 0, this.MapLoader.MapWidth, this.MapLoader.MapHeight));
    this.Camera.FollowObject = this.GetChildByName("Ninja");
    this.Camera.BringToFront();
    this.Crosshair.BringToFront();
    this.Camera.FollowObject.BringToFront();
    var cameraComponent = this.Camera.GetComponent("CameraComponent");
    cameraComponent.ClampMinX = 0;
    cameraComponent.ClampMinY = 0;
    cameraComponent.ClampMaxX = this.MapLoader.MapWidth;
    cameraComponent.ClampMaxY = this.MapLoader.MapHeight;

    this.AddChild(new TextObject(this.MapLoader.Name, 48, 5000));
    var that = this;
    setTimeout( function()
    {
        if(that.Objective == 0) that.AddChild(new TextObject("Head Northeast!"));
    }, 5500);

    var mouseInstruction = this.AddChild(new SimpleImageObject("images/MouseImage1.png"));
    mouseInstruction.Transform.X = this.GetChildByName("Ninja").Transform.X + 200;
    mouseInstruction.Transform.Y = this.GetChildByName("Ninja").Transform.Y;
};

LevelScene.Update = function(gameTime)
{
    this.Base.Update.call(this, gameTime);
};

LevelScene.Draw = function(context, gameTime)
{
    var i;
    var basicCullingArray = [];
    var aLittleExtra = 300;
    for (i in this.Children)
    {
        var transform = this.Children[i].Transform;

        if (this.Children[i].Name.indexOf("GrassBackground") == -1)
        {
            if (transform.X < this.Camera.Transform.X - Game.Width / 2 - aLittleExtra)
                continue;
            else if (transform.X > this.Camera.Transform.X + Game.Width / 2 + aLittleExtra)
                continue;
            else if (transform.Y < this.Camera.Transform.Y - Game.Height / 2 - aLittleExtra)
                continue;
            else if (transform.Y > this.Camera.Transform.Y + Game.Height / 2 + aLittleExtra)
                continue;
        }

        basicCullingArray.push(this.Children[i]);
    }

    var sortedChildrenArray = basicCullingArray;
    sortedChildrenArray.sort(function(a,b)
    {
        return b.Transform.Y - a.Transform.Y + ((b.Transform.Y == a.Transform.Y) ? a.Transform.X - b.Transform.X : 0) + (a.Depth - b.Depth) * 10000000;
    });

    for (i = 0; i < this.Components.length; i++)
        this.Components[i].Draw(context, gameTime);

    for (i = sortedChildrenArray.length - 1; i >= 0; i--)
        sortedChildrenArray[i].Draw(context, gameTime);
};
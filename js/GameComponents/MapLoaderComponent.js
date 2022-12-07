var MapLoaderComponent = function ()
{
    var instance = new GameComponent();
    instance.Base = GameComponent;
    instance.Type = "MapLoaderComponent";

    instance.Json = undefined;
    instance.LevelNumber = undefined;
    instance.Name = undefined;
    instance.MapWidth = undefined;
    instance.MapHeight = undefined;
    instance.GameObjects = undefined;
    instance.Triggers = undefined;

    instance.LoadContent = MapLoaderComponent.LoadContent;

    return instance;
};

MapLoaderComponent.LoadContent = function()
{
    this.Json = JSONLoader.Load("js/Scenes/Maps.json");

    if (this.LevelNumber >= 0)
    {
        var level = this.Json.Levels[this.LevelNumber];
        if (level)
        {
            this.Name = level.Name;
            this.MapWidth = level.MapWidth;
            this.MapHeight = level.MapHeight;
            this.Triggers = level.Triggers;
            this.GameObjects = level.GameObjects;
        }
        else
        {
            console.log("Please ensure you select the right level and set level number before loading content");
        }
    }

    this.Base.LoadContent.call(this);
};
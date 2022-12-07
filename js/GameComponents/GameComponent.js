var GameComponent = function ()
{
    var instance = {};
    instance.Base = Object;
    instance.Type = "GameComponent";

    instance.Id = GameComponent.NextId++;
    instance.GameObject = undefined;
    instance.Initialized = false;
    instance.Loaded = false;
    instance.Enabled = false;
    instance.Visible = false;

    instance.Initialize = GameComponent.Initialize;
    instance.LoadContent = GameComponent.LoadContent;
    instance.Update = GameComponent.Update;
    instance.Draw = GameComponent.Draw;
    instance.Destroy = GameComponent.Destroy;
    instance.Test = GameComponent.Test;
    instance.GetType = GameComponent.GetType;
    instance.GetBaseType = GameComponent.GetBaseType;

    instance.ScheduleDestroy = false;

    return instance;
};

GameComponent.NextId = 0;
GameComponent.Type = "GameComponent";

GameComponent.Initialize = function ()
{
    if (!this.Initialized)
        this.Initialized = true;

    this.LoadContent();
};

GameComponent.LoadContent = function ()
{
    if (!this.Loaded)
    {
        this.Loaded = true;
        this.Enabled = true;
        this.Visible = true;
    };
};

GameComponent.Update = function (gameTime)
{
    if (this.Enabled)
    {
    }

    if (this.ScheduleDestroy)
        this.Destroy();
};

GameComponent.Draw = function (gameTime)
{
    if (this.Visible)
    {
    }
};

GameComponent.Destroy = function ()
{
    var base = this.Base;
    if (base)
    {
        this.Base = null;
        base.Destroy.call(this);
    }

    if (this.GameObject)
    {
        this.GameObject.RemoveComponent(this);
        this.GameObject = null;
    }

    for (var i in this)
        if (this.hasOwnProperty(i))
            this[i] = null;
};

GameComponent.Test = function ()
{
    console.log(this);
};


/** @return {string} */
GameComponent.GetType = function()
{
    return this.Type;
};

/** @return {string} */
GameComponent.GetBaseType = function()
{
    if (this.Base && this.Base.GetBaseType)
        return this.Base.GetBaseType();

    return this.Type;
};
var GameObject = function(name)
{
    var instance = {};
    instance.Base = Object;
    instance.Type = "GameObject";

    instance.Id = GameObject.NextId++;
    instance.JsonId = undefined;
    instance.Name = name ? name : "GameObject" + instance.Id;
    instance.Parent = undefined;
    instance.Initialized = false;
    instance.Loaded = false;
    instance.Enabled = false;
    instance.Visible = false;
    instance.Depth = 0;

    instance.Components = [];
    instance.Children = [];
    instance.Transform = undefined;
    instance.Physics = undefined;

    instance.AddComponent = GameObject.AddComponent;
    instance.RemoveComponent = GameObject.RemoveComponent;
    instance.GetComponent = GameObject.GetComponent;
    instance.AddChild = GameObject.AddChild;
    instance.RemoveChild = GameObject.RemoveChild;
    instance.Initialize = GameObject.Initialize;
    instance.LoadContent = GameObject.LoadContent;
    instance.Update = GameObject.Update;
    instance.Draw = GameObject.Draw;
    instance.Destroy = GameObject.Destroy;
    instance.Test = GameObject.Test;
    instance.GetBaseType = GameObject.GetBaseType;
    instance.GetChildByName = GameObject.GetChildByName;
    instance.GetChildrenByName = GameObject.GetChildrenByName;
    instance.GetChildByJsonId = GameObject.GetChildByJsonId;
    instance.CountChildrenByType = GameObject.CountChildrenByType;
    instance.SendToBack = GameObject.SendToBack;
    instance.BringToFront = GameObject.BringToFront;

    instance.ScheduleDestroy = false;

    return instance;
};

GameObject.NextId = 0;
GameObject.Type = "GameObject";

GameObject.AddComponent = function(component)
{
    if (component && component.GetBaseType() != "GameComponent")
    {
        console.log("Cannot insert object as component. Try AddChild function!");
    }
    else if (component && component.GetBaseType() == "GameComponent")
    {
        this.Components.push(component);
        component.GameObject = this;

        if (this.Initialized && !component.Initialized)
            component.Initialize();

        if (this.Loaded && !component.Loaded)
            component.LoadContent();

        return component;
    }
};

GameObject.RemoveComponent = function(component)
{

    if (component && component.GetBaseType() == "GameComponent")
    {
        for (var i = this.Components.length - 1; i >= 0; i--)
        {
            if (this.Components[i].Id == component.Id)
            {
                this.Components[i].GameObject = undefined;
                this.Components.splice(i, 1);
            }
        }

        return component;
    }
};

GameObject.BringToFront = function()
{
    if (this.Parent)
    {
        var i = this.Parent.Children.indexOf(this);
        this.Parent.Children.splice(i, 1);
        this.Parent.Children.push(this);
    }
};

GameObject.SendToBack = function()
{
    if (this.Parent)
    {
        var i = this.Parent.Children.indexOf(this);
        this.Parent.Children.splice(i, 1);
        this.Parent.Children.unshift(this);
    }
};

GameObject.GetComponent = function(type)
{
    for (var i = this.Components.length - 1; i >= 0; i--)
        if (this.Components[i].GetType() == type)
            return this.Components[i];
};

GameObject.AddChild = function(child)
{
    if (child && child.GetBaseType() != "GameObject")
    {
        console.log("Cannot insert component as child. Try AddComponent function!");
        return;
    }

    if (child && child.GetBaseType() == "GameObject")
    {
        this.Children.push(child);
        child.Parent = this;

        if (this.Initialized && !child.Initialized)
            child.Initialize();

        if (this.Loaded && !child.Loaded)
            child.LoadContent();

        return child;
    }
};

GameObject.RemoveChild = function(child)
{
    if (child && child.GetBaseType() == "GameObject")
    {
        for (var i = this.Children.length - 1; i >= 0; i--)
        {
            if (this.Children[i].Id == child.Id)
            {
                this.Children[i].Parent = undefined;
                this.Children.splice(i, 1);
            }
        }
        return child;
    }
};

GameObject.GetChildByName = function(name)
{
    for (var i = 0; i < this.Children.length; i++)
        if (this.Children[i].Name.indexOf(name) > -1)
            return this.Children[i];
};

GameObject.GetChildrenByName = function(name)
{
    var children = [];
    for (var i = 0; i < this.Children.length; i++)
        if (this.Children[i].Name.indexOf(name) > -1)
            children.push(this.Children[i]);
    return children;
};

GameObject.GetChildByJsonId = function(jsonId)
{
    for (var i = 0; i < this.Children.length; i++)
        if (this.Children[i].JsonId == jsonId)
            return this.Children[i];
};

// TODO implement type on Game Object
/** @return {number} */
GameObject.CountChildrenByType = function(type)
{
    var count = 0;
    for (var i = 0; i < this.Children.length; i++)
        if (this.Children[i].Name.indexOf(type) > -1)
            count++;
    return count;
};

GameObject.Initialize = function()
{
    if (!this.Initialized)
    {
        this.Initialized = true;

        this.Transform = new TransformComponent(this);
        this.AddComponent(this.Transform);

        var i;
        for (i = 0; i < this.Components.length; i++)
            this.Components[i].Initialize();

        for (i = 0; i < this.Children.length; i++)
            this.Children[i].Initialize();
    }
    this.LoadContent();
};

GameObject.LoadContent = function()
{
    if (!this.Loaded)
    {
        this.Loaded = true;
        this.Enabled = true;
        this.Visible = true;

        var i;
        for (i = 0; i < this.Children.length; i++)
            this.Children[i].LoadContent();

        for (i = 0; i < this.Components.length; i++)
            this.Components[i].LoadContent();
    }
};

GameObject.Update = function(gameTime)
{
    if (this.Enabled)
    {
        var i;
        for (i = 0; i < this.Children.length; i++)
            this.Children[i].Update(gameTime);

        for (i = 0; i < this.Components.length; i++)
            this.Components[i].Update(gameTime);
    }

    if (this.ScheduleDestroy)
        this.Destroy();
};

GameObject.Draw = function (context, gameTime)
{
    if (this.Visible)
    {
        var i;
        for (i = 0; i < this.Children.length; i++)
            this.Children[i].Draw(context, gameTime);

        for (i = 0; i < this.Components.length; i++)
            if (this.Components[i].Draw)
                this.Components[i].Draw(context, gameTime);
    }
};

GameObject.Destroy = function()
{
    var base = this.Base;
    if (base)
    {
        this.Base = null;
        base.Destroy.call(this);
    }

    var i;
    if (this.Children)
    {
        for (i = this.Children.length - 1; i >= 0; i--)
            this.Children[i].Destroy();

        this.Children = null;
    }

    if (this.Components)
    {
        for (i = this.Components.length - 1; i >= 0; i--)
            this.Components[i].Destroy();

        this.Components = null;
    }

    if (this.Parent)
    {
        this.Parent.RemoveChild(this);
        this.Parent = null;
    }

    for (i in this)
        if(this.hasOwnProperty(i))
            this[i] = null;

    if (Game.Scene.Trigger) Game.Scene.Trigger.MarkCondition("NumberEqual");
};

GameObject.Test = function()
{
    //console.log(this);
};

/** @return {string} */
GameObject.GetBaseType = function()
{
    if (this.Base && this.Base.GetBaseType)
        return this.Base.GetBaseType();

    return this.Type;
};
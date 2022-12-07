var BoundingBoxComponent = function(animationOrX, y, w, h)
{
    var instance = new GameComponent();
    instance.Base = GameComponent;
    instance.Type = "BoundingBoxComponent";

    if (animationOrX && isNaN(animationOrX))
    {
        instance.IsAnimation = true;
        instance.Animation = animationOrX;
        instance.Initialize = BoundingBoxComponent.AnimationInitialize;
        instance.Update = BoundingBoxComponent.AnimationUpdate;
    }
    else
    {
        instance.Left = animationOrX ? animationOrX : 0;
        instance.Right = animationOrX >= 0 && w ? animationOrX + w : 0;
        instance.Top = y ? y : 0;
        instance.Bottom = y >= 0 && h? y + h : 0;
        instance.Width = w ? w : 0;
        instance.Height = h ? h : 0;
        instance.CenterX = instance.Left + instance.Width / 2;
        instance.CenterY = instance.Top + instance.Height / 2;
        instance.IsAnimation = false;
        instance.Update = BoundingBoxComponent.Update;
    }

    return instance;
};

BoundingBoxComponent.AnimationInitialize = function()
{
    this.Base.Initialize.call(this);
};

BoundingBoxComponent.AnimationUpdate = function(gameTime)
{
    this.Base.Update.call(this, gameTime);
};

BoundingBoxComponent.Update = function(gameTime)
{
    this.Base.Update.call(this, gameTime);
};
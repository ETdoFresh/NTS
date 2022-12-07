var Crosshair = function()
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "Crosshair" + instance.Id;
    instance.Initialize = Crosshair.Initialize;
    instance.Update = Crosshair.Update;
    instance.Image = undefined;
    return instance;
};

Crosshair.Initialize = function()
{
    this.Base.Initialize.call(this);
    this.Image = this.AddComponent(new ImageComponent("images/crosshairred-md.png"));
    this.Transform.ScaleX = 0.1;
    this.Transform.ScaleY = 0.1;
    this.Image.IsCenter = true;
};

Crosshair.Update = function(gameTime)
{
    if (Mouse.ButtonPressed)
    {
        this.Transform.X = Mouse.GameX;
        this.Transform.Y = Mouse.GameY;
    }
    this.Base.Update.call(this, gameTime);
}
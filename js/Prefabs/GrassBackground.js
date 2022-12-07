var GrassBackground = function(repeatX, repeatY)
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "GrassBackground" + instance.Id;
    instance.RepeatX = repeatX ? repeatX : 1;
    instance.RepeatY = repeatY ? repeatY : 1;
    instance.Initialize = GrassBackground.Initialize;
    return instance;
};

GrassBackground.Initialize = function()
{
    var image;
    for(var i = 0; i < this.RepeatX; i++)
    {
        for (var j = 0; j < this.RepeatY; j++)
        {
            var image = this.AddComponent(new ImageComponent("images/GrassBackground.jpg"));
            image.AnchorX = -i;
            image.AnchorY = -j;
        }
    }
    this.Base.Initialize.call(this);
}
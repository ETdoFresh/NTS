var ImageComponent = function(filename, anchorX, anchorY)
{
    var instance = new GameComponent();
    instance.Base = GameComponent;
    instance.Type = "ImageComponent";

    instance.Name = "ImageComponent" + instance.Id;
    instance.Filename = filename;
    instance.Image = undefined;
    instance.Width = 0;
    instance.Height = 0;
    instance.AnchorX = anchorX >= 0 ? anchorX : 0.5;
    instance.AnchorY = anchorY >= 0 ? anchorY : 0.5;
    instance.Alpha = 1;

    instance.LoadContent = ImageComponent.LoadContent;
    instance.Draw = ImageComponent.Draw;
    instance.Destroy = ImageComponent.Destroy;

    return instance;
};

ImageComponent.LoadContent = function()
{
    this.Image = new Image();
    this.Image.src = this.Filename;
    this.Base.LoadContent.call(this);

    var that = this;
    this.Image.onload = function(ev)
    {
        that.Width = that.Image.width;
        that.Height = that.Image.height;
    }
};

ImageComponent.Draw = function(context, gameTime)
{
    if (this.Visible)
    {
        var image = this.Image;
        var sx = 0;
        var sy = 0;
        var swidth = this.Width;
        var sheight = this.Height;
        var x = this.GameObject.Transform.GetContentX();
        var y = this.GameObject.Transform.GetContentY();
        var width = swidth * this.GameObject.Transform.GetContentScaleX();
        var height = sheight * this.GameObject.Transform.GetContentScaleY();
        var drawX = -width * this.AnchorX;
        var drawY = -height * this.AnchorY;
        if (width > 0 && height > 0)
        {
            context.save();
            context.translate(x, y);
            context.rotate(this.GameObject.Transform.Rotation);
            context.globalAlpha = this.Alpha;
            context.drawImage(image, sx, sy, swidth, sheight, drawX, drawY, width, height);
            context.restore();
        }
    }

    this.Base.Draw.call(this, context, gameTime);
};

ImageComponent.Destroy = function()
{
    this.Image.onload = null;
    this.Base.Destroy.call(this);
};
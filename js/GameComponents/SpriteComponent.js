var SpriteComponent = function(imageFilename, textureAtlasFilename, index)
{
    var instance = new GameComponent();
    instance.Base = GameComponent;
    instance.Type = "SpriteComponent";

    instance.Name = "SpriteComponent" + instance.Id;
    instance.ImageFilename = imageFilename;
    instance.TextureAtlasFilename = textureAtlasFilename;
    instance.Image = undefined;
    instance.Width = 0;
    instance.Height = 0;
    instance.AnchorX = 0.5;
    instance.AnchorY = 0.5;
    instance.TextureAtlas = undefined;
    instance.Index = index ? index : 0;
    instance.SourceRectangle = { X: 0, Y: 0, W: 0, H: 0 };

    instance.ChangeIndex = SpriteComponent.ChangeIndex;
    instance.LoadContent = SpriteComponent.LoadContent;
    instance.Draw = SpriteComponent.Draw;

    return instance;
};

SpriteComponent.ChangeIndex = function(index)
{
    var textureAtlasFrame = this.TextureAtlas.frames[index].frame;
    this.SourceRectangle.X = textureAtlasFrame.x;
    this.SourceRectangle.Y = textureAtlasFrame.y;
    this.SourceRectangle.W = textureAtlasFrame.w;
    this.SourceRectangle.H = textureAtlasFrame.h;

    this.Width = textureAtlasFrame.w;
    this.Height = textureAtlasFrame.h;
};

SpriteComponent.LoadContent = function()
{
    if (this.ImageFilename && this.TextureAtlasFilename)
    {
        this.TextureAtlas = JSONLoader.Load(this.TextureAtlasFilename);
        this.ChangeIndex(this.Index);

        this.Image = new Image();
        this.Image.src = this.ImageFilename;

        var that = this;
        this.Image.onload = function()
        {
            that.Base.LoadContent.call(that);
        }
    }
    else
    {
        console.log("Could not Load SpriteContent because filenames not specified")
    }
};

SpriteComponent.Draw = function(context, gameTime)
{
    if (this.Visible)
    {
        var image = this.Image;
        var sx = this.SourceRectangle.X;
        var sy = this.SourceRectangle.Y;
        var swidth = this.SourceRectangle.W;
        var sheight = this.SourceRectangle.H;
        var x = this.GameObject.Transform.GetContentX();
        var y = this.GameObject.Transform.GetContentY();
        var width = swidth * this.GameObject.Transform.GetContentScaleX();
        var height = sheight * this.GameObject.Transform.GetContentScaleY();
        var drawX = -width * this.AnchorX;
        var drawY = -height * this.AnchorY;
        context.save();
        context.translate(x, y);
        context.rotate(this.GameObject.Transform.Rotation);
        context.drawImage(image, sx, sy, swidth, sheight, drawX, drawY, width, height);
        context.restore();
    }

    this.Base.Draw.call(this, context, gameTime);
};
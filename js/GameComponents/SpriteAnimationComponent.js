var SpriteAnimationComponent = function(imageFilename, textureAtlasFilename, animationData)
{
    var instance = new GameComponent();
    instance.Base = GameComponent;
    instance.Type = "SpriteAnimationComponent";

    instance.Name = "SpriteAnimationComponent" + instance.Id;
    instance.ImageFilename = imageFilename;
    instance.TextureAtlasFilename = textureAtlasFilename;
    instance.Image = undefined;
    instance.Width = 0;
    instance.Height = 0;
    instance.AnchorX = 0.5;
    instance.AnchorY = 0.5;
    instance.TextureAtlas = undefined;
    instance.Index = 0;
    instance.SourceRectangle = { X: 0, Y: 0, W: 0, H: 0 };

    // AnimationData is an array of animations objects similar to following:
    // { Name: "Spin", Frames: [0, 1, 2, 3], Time: 133, Loop: true }
    instance.AnimationData = animationData;
    instance.CurrentAnimation = undefined;
    instance.TimePerFrame = 1000;
    instance.CurrentFrame = 0;
    instance.TotalFrames = 0;
    instance.TimeSinceLastFrameChange = 0;
    instance.IsLooping = true;

    instance.SetAnimationByIndex = SpriteAnimationComponent.SetAnimationByIndex;
    instance.SetAnimationByName = SpriteAnimationComponent.SetAnimationByName;
    instance.ChangeIndex = SpriteAnimationComponent.ChangeIndex;
    instance.LoadContent = SpriteAnimationComponent.LoadContent;
    instance.Update = SpriteAnimationComponent.Update;
    instance.Draw = SpriteAnimationComponent.Draw;

    return instance;
};

SpriteAnimationComponent.GenerateFramesObject = function(start, count)
{
    var frames = [];

    for (var i = start; i < start + count; i++)
        frames.push(i);

    return frames;
};

SpriteAnimationComponent.SetAnimationByIndex = function(index, isRestartAnimation)
{
    if (this.AnimationData && this.AnimationData[index])
    {
        this.CurrentAnimation = this.AnimationData[index];
        this.TotalFrames = this.CurrentAnimation.Frames.length;
        this.TimePerFrame = this.CurrentAnimation.Time / this.TotalFrames;
        this.IsLooping = this.CurrentAnimation.Loop ? this.CurrentAnimation.Loop : false;

        if (isRestartAnimation)
        {
            this.CurrentFrame = 0;
            this.TimeSinceLastFrameChange = 0;
            this.Index = this.CurrentAnimation.Frames[0];
        }
    }
    else
    {
        console.log("SpriteAnimationComponent could not set animat to " + index);
    }
};

SpriteAnimationComponent.SetAnimationByName = function(name, isRestartAnimation)
{
    for (var i = 0; i < this.AnimationData.length; i++)
        if (this.AnimationData[i].Name == name)
            return this.SetAnimationByIndex(i, isRestartAnimation);
};

SpriteAnimationComponent.ChangeIndex = function(index)
{
    var textureAtlasFrame = this.TextureAtlas.frames[index].frame;
    this.SourceRectangle.X = textureAtlasFrame.x;
    this.SourceRectangle.Y = textureAtlasFrame.y;
    this.SourceRectangle.W = textureAtlasFrame.w;
    this.SourceRectangle.H = textureAtlasFrame.h;

    this.Width = textureAtlasFrame.w;
    this.Height = textureAtlasFrame.h;
};

SpriteAnimationComponent.LoadContent = function()
{
    if (this.ImageFilename && this.TextureAtlasFilename && this.AnimationData)
    {
        this.SetAnimationByIndex(0, true);

        this.TextureAtlas = JSONLoader.Load(this.TextureAtlasFilename);
        this.ChangeIndex(this.Index);

        this.Image = new Image();
        this.Image.src = this.ImageFilename;
    }
    else
    {
        console.log("Could not Load SpriteContent because filenames or animation data not specified")
    }

    this.Base.LoadContent.call(this);
};

SpriteAnimationComponent.Update = function(gameTime)
{
    this.TimeSinceLastFrameChange += gameTime.DeltaTime;
    while(this.TimeSinceLastFrameChange > this.TimePerFrame)
    {
        this.TimeSinceLastFrameChange -= this.TimePerFrame;
        this.CurrentFrame++;
    }

    while(this.CurrentFrame > this.TotalFrames - 1)
    {
        if (this.IsLooping)
            this.CurrentFrame -= this.TotalFrames;
        else
            this.CurrentFrame = this.TotalFrames - 1;
    }

    if (this.CurrentAnimation.Frames[this.CurrentFrame] != this.Index)
    {
        this.Index = this.CurrentAnimation.Frames[this.CurrentFrame];
        this.ChangeIndex(this.Index);
    }
};

SpriteAnimationComponent.Draw = function(context, gameTime)
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
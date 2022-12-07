var CameraComponent = function()
{
    var instance = new GameComponent();
    instance.Base = GameComponent;
    instance.Type = "CameraComponent";
    instance.Initialize = CameraComponent.Initialize;
    instance.Update = CameraComponent.Update;
    instance.Draw = CameraComponent.Draw;
    instance.ClampMinX = undefined;
    instance.ClampMaxX = undefined;
    instance.ClampMinY = undefined;
    instance.ClampMaxY = undefined;

    return instance;
};

CameraComponent.Initialize = function()
{
    this.Base.Initialize.call(this);
    var image = new Image();
    image.src = "images/camera.png";
    var that = this;
    image.onload = function() { that.Image = image; };
    this.Visible = false;
};

CameraComponent.Update = function(gameTime)
{
    if (this.GameObject.FollowObject && this.GameObject.FollowObject.Transform)
    {
        this.GameObject.Transform.X = this.GameObject.FollowObject.Transform.X;
        this.GameObject.Transform.Y = this.GameObject.FollowObject.Transform.Y;
    }

    if (this.ClampMaxX >= 0)
        this.GameObject.Transform.X = Math.min(this.ClampMaxX - Game.Width / 2, this.GameObject.Transform.X);
    if (this.ClampMinX >= 0)
        this.GameObject.Transform.X = Math.max(this.ClampMinX + Game.Width / 2, this.GameObject.Transform.X);
    if (this.ClampMaxY >= 0)
        this.GameObject.Transform.Y = Math.min(this.ClampMaxY - Game.Height / 2, this.GameObject.Transform.Y);
    if (this.ClampMinY >= 0)
        this.GameObject.Transform.Y = Math.max(this.ClampMinY + Game.Height / 2, this.GameObject.Transform.Y);

    if (Game.Scene)
    {
        Game.Scene.Transform.X = -this.GameObject.Transform.X + Game.Width / 2;
        Game.Scene.Transform.Y = -this.GameObject.Transform.Y + Game.Height / 2;
    }

    this.Base.Update.call(this, gameTime);
};

CameraComponent.Draw = function(context, gameTime)
{
    this.Base.Draw.call(this, context, gameTime);
    if (this.Visible && this.Image)
        context.drawImage(this.Image, this.GameObject.Transform.GetContentX() - this.Image.width / 2,
            this.GameObject.Transform.GetContentY() - this.Image.height / 2);
};
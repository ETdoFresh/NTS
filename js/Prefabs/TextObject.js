var TextObject = function(text, size, lifeTime, fadeTime)
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "TextObject" + instance.Id;
    instance.Text = text ? text : "Unspecified";
    instance.Size = size ? size : 48;
    instance.Initialize = TextObject.Initialize;
    instance.Update = TextObject.Update;
    instance.Draw = TextObject.Draw;
    instance.Depth = -10;
    instance.Alpha = 1;
    instance.LifeTime = lifeTime;
    instance.FadeTime = fadeTime ? fadeTime : 250;
    instance.LifeTimer = 0;
    return instance;
};

TextObject.Initialize = function()
{
    this.Base.Initialize.call(this);
    var otherTextChildren = this.Parent.GetChildrenByName("TextObject");
    for (var i in otherTextChildren)
        if (otherTextChildren[i] != this)
            otherTextChildren[i].LifeTime = otherTextChildren[i].LifeTimer + otherTextChildren[i].FadeTime;
};

TextObject.Update = function(gameTime)
{
    if (this.LifeTime > 0)
    {
        this.LifeTimer += gameTime.DeltaTime;

        if (this.LifeTimer >= this.LifeTime - this.FadeTime) // Fade Out
            this.Alpha = (this.FadeTime - (this.LifeTimer - (this.LifeTime - this.FadeTime))) / this.FadeTime;
        else if (this.LifeTimer <= this.FadeTime) // Fade In
            this.Alpha = this.LifeTimer / this.FadeTime;
        else // Static
            this.Alpha = 1;

        if (this.LifeTimer >= this.LifeTime)
            this.ScheduleDestroy = true;
    }

    this.Transform.X = Game.Scene.Camera.Transform.X;
    this.Transform.Y = Game.Scene.Camera.Transform.Y + Game.Height / 2 - 50;

    this.Base.Update.call(this, gameTime);
};

TextObject.Draw = function(context, gameTime)
{
    this.Base.Draw.call(this, context, gameTime);

    context.save();
    context.translate(this.Transform.GetContentX(), this.Transform.GetContentY());
    context.rotate(this.Transform.Rotation);
    context.textAlign = "center";
    context.textBaseline = "Middle";
    context.font = "bold " + this.Size + "px Arial";

    context.globalAlpha = this.Alpha * 0.5;
    context.fillStyle="#000000";
    context.fillText(this.Text, this.Size / 6, this.Size / 6);

    context.globalAlpha = this.Alpha;
    context.fillStyle="#FFFFFF";
    context.fillText(this.Text, 0, 0);

    context.restore();
};
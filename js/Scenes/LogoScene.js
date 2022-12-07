var LogoScene = function()
{
    var instance = new GameObject("Logo Scene");
    instance.Base = GameObject;

    instance.Type = "Scene";
    instance.SceneTime = 3000;
    instance.Initialize = LogoScene.Initialize;
    instance.Draw = LogoScene.Draw;

    return instance;
};

LogoScene.Initialize = function()
{
    this.Base.Initialize.call(this);
    var image = this.AddComponent(new ImageComponent("images/Logo.png", 0, 0));
    setTimeout(function() { Game.ChangeScene(new LevelScene("Level 0", 0)) }, this.SceneTime);
};

LogoScene.Draw = function(context, gameTime)
{
    context.fillStyle = 'black';
    context.fillRect(0, 0, Game.Width, Game.Height);
    var i;
    for (i = 0; i < this.Components.length; i++)
        this.Components[i].Draw(context, gameTime);

    for (i = 0; i < this.Children.length; i++)
        this.Children[i].Draw(context, gameTime);
};
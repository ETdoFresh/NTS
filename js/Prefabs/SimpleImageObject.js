var SimpleImageObject = function(filename)
{
    var instance = new GameObject(name);
    instance.Base = GameObject;
    instance.Name = "SimpleImageObject" + instance.Id;
    instance.Filename = filename ? filename : undefined;
    instance.Initialize = SimpleImageObject.Initialize;

    return instance;
};

SimpleImageObject.Initialize = function()
{
    this.AddComponent(new ImageComponent(this.Filename, 0, 0));
    this.Base.Initialize.call(this);
};
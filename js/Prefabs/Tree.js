var Tree = function()
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "Tree" + instance.Id;
    instance.LoadContent = Tree.LoadContent;
    return instance;
};

Tree.LoadContent = function()
{
    this.Base.LoadContent.call(this);

    var randomTreeIndex = RandomInt(1, 4);
    var image = this.AddComponent(new ImageComponent("images/Tree" + randomTreeIndex + ".png", 0.5, 0.8));
    this.Transform.ScaleX = Random(0.8, 0.9);
    this.Transform.ScaleY = this.Transform.ScaleX;
};
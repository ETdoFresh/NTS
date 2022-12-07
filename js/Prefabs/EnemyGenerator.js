var EnemyGenerator = function(x, y, width, height, maxEnemies, timeSpan)
{
    var instance = new GameObject();
    instance.Base = GameObject;
    instance.Name = "EnemyGenerator" + instance.Id;
    instance.X = x ? x : 0;
    instance.Y = y ? y : 0;
    instance.Width = width ? width : 100;
    instance.Height = height ? height : 100;
    instance.MaxEnemies = maxEnemies ? maxEnemies : 5;
    instance.TimeSpan = timeSpan ? timeSpan : 500;
    instance.Timer = 0;
    instance.Update = EnemyGenerator.Update;
    return instance;
};

EnemyGenerator.Update = function(gameTime)
{
    this.Timer += gameTime.DeltaTime;

    var parent = this.Parent;
    if (this.Timer > this.TimeSpan)
    {
        this.Timer = 0;

        if (parent.CountChildrenByType("Enemy") < this.MaxEnemies)
        {
            var enemy = parent.AddChild(new Enemy());
            enemy.Transform.X = RandomInt(this.X, this.X + this.Width);
            enemy.Transform.Y = RandomInt(this.Y, this.Y + this.Height);
            enemy.Physics.MoveToPosition(enemy.Transform.X, enemy.Transform.Y);
        }
    }

    this.Base.Update.call(this, gameTime);
};
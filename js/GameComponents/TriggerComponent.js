var TriggerComponent = function(JsonTriggers)
{
    var instance = new GameComponent();
    instance.Base = GameComponent;
    instance.Name = "TriggerComponent" + instance.Id;
    instance.Triggers = JsonTriggers;
    instance.Update = TriggerComponent.Update;
    instance.MarkCondition = TriggerComponent.MarkCondition;
    instance.CheckConditions = TriggerComponent.CheckConditions;
    return instance;
};

TriggerComponent.Update = function(gameTime)
{
    this.Base.Update.call(this, gameTime);
    this.CheckConditions();
};

TriggerComponent.MarkCondition = function(conditionType, objectOrType, objectBorNumber)
{
    for (var i = 0; i < this.Triggers.length; i++)
    {
        var trigger = this.Triggers[i];
        for (var j = 0; j < trigger.Conditions.length; j++)
        {
            var condition = trigger.Conditions[j];
            if (condition.Type == conditionType)
            {
                switch (condition.Type)
                {
                    case "Collide":
                        if (objectOrType.JsonId == condition.ObjectA && objectBorNumber.JsonId == condition.ObjectB)
                            condition.Satisfied = true;
                        else if (objectOrType.Name.indexOf(condition.ObjectType) > -1)
                            if (objectBorNumber.JsonId == condition.Object)
                                condition.Satisfied = true;
                        break;
                    case "Destroy":
                        if (objectOrType.JsonId == condition.Object)
                            condition.Satisfied = true;
                        break;
                    case "NumberEqual":
                        if (this.GameObject.CountChildrenByType(condition.Object) == condition.Number)
                            condition.Satisfied = true;
                        break;
                }
            }
        }
    }
};

TriggerComponent.CheckConditions = function()
{
    var i, j, trigger, condition, isSatisfied, action;
    for (i = 0; i < this.Triggers.length; i++)
    {
        trigger = this.Triggers[i];

        if (trigger.HasRun && !trigger.IsLooping)
            continue;

        if (!trigger.Enabled)
            continue;

        // Check if all conditions are true
        isSatisfied = true;
        for (j = 0; j < trigger.Conditions.length; j++)
        {
            condition = trigger.Conditions[j];
            if (!condition.Satisfied)
            {
                isSatisfied = false;
                break;
            }
        }

        // If all conditions are true, run actions
        if (isSatisfied)
        {
            for (j = 0; j < trigger.Actions.length; j++)
            {
                action = trigger.Actions[j];
                switch (action.Type)
                {
                    case "SetProperty":
                        if (action.Object >= 0)
                            this.GameObject.GetChildByJsonId(action.Object)[action.Property] = action.Value;
                        else
                            this.GameObject[action.Property] = action.Value;
                        break;
                    case "ShowText":
                        this.GameObject.AddChild(new TextObject(action.Text, action.Size, action.Time));
                        break;
                    case "EnableTrigger":
                        this.Triggers[action.Trigger].Enabled = action.IsEnabled === false ? false : true;
                        break;
                    case "Create":
                        if (action.Object == "EnemyGenerator")
                        {
                            var enemyGenerator = this.GameObject.AddChild(new EnemyGenerator())
                            enemyGenerator.X = action.X ? action.X : enemyGenerator.X;
                            enemyGenerator.Y = action.Y ? action.Y : enemyGenerator.Y;
                            enemyGenerator.Width = action.Width ? action.Width : enemyGenerator.Width;
                            enemyGenerator.Height = action.Height ? action.Height : enemyGenerator.Height;
                            enemyGenerator.MaxEnemies = action.MaxEnemies ? action.MaxEnemies : enemyGenerator.MaxEnemies;
                            enemyGenerator.TimeSpan = action.TimeSpan ? action.TimeSpan : enemyGenerator.TimeSpan;
                        }
                }
            }
            trigger.HasRun = true;
        }
    }
};
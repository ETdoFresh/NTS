var JSONLoader =
{
    LoadAsync: function(filename, callback)
    {
        var isAsync = callback != undefined;
        //noinspection SpellCheckingInspection
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', filename, isAsync);
        xobj.send(null);
        if (isAsync)
        {
            xobj.onreadystatechange = function ()
            {
                if (xobj.readyState == 4 && xobj.status == "200")
                {
                    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                    callback(JSON.parse(xobj.responseText));
                }
            };
        }
        else
        {
            if (xobj.status == "200")
                return JSON.parse(xobj.responseText);
        }
    },

    Load: function(filename)
    {
        return JSONLoader.LoadAsync(filename);
    }
};
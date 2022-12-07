var Mouse =
{
    UnscaledCanvasX: 0, // x,y coordinates of mouse relative to top left corner of canvas
    UnscaledCanvasY: 0,
    CanvasX: 0, // x,y coordinates of mouse relative to top left corner of game map
    CanvasY: 0,
    GameX: 0,
    GameY: 0,
    ButtonPressed: false, // whether or not the left mouse button is currently pressed
    RightButtonPressed: false,
    InsideCanvas: false, // whether or not the mouse is inside the canvas region
    Transform: undefined,

    Initialize: function ()
    {
        Mouse.Transform = new TransformComponent();
        var mouseCanvas = Game.Canvas;
        mouseCanvas.addEventListener("mousemove" ,function(ev)
        {
            var rect = mouseCanvas.getBoundingClientRect();
            Mouse.UnscaledCanvasX = ev.clientX - rect.left;
            Mouse.UnscaledCanvasY = ev.clientY - rect.top;
            Mouse.CalculateGameCoordinates();
        });

        mouseCanvas.addEventListener("click", function(ev)
        {
            return false;
        });

        mouseCanvas.addEventListener("mousedown", function(ev)
        {
            if (ev.which == 1)
            {
                Mouse.ButtonPressed = true;
                ev.preventDefault();
            }
            else
            {
                Mouse.RightButtonPressed = true;
                ev.preventDefault();
            }
            return false;
        });

        mouseCanvas.addEventListener("contextmenu", function(ev)
        {
            ev.preventDefault();
            Mouse.Click(ev, true);
            return false;
        });

        mouseCanvas.addEventListener("mouseup", function(ev)
        {
            if (ev.which == 1)
                Mouse.ButtonPressed = false;
            else
                Mouse.RightButtonPressed = false;

            return false;
        });

        //noinspection JSUnusedLocalSymbols
        mouseCanvas.addEventListener("mouseleave", function(ev)
        {
            Mouse.InsideCanvas = false;
        });

        //noinspection JSUnusedLocalSymbols
        mouseCanvas.addEventListener("mouseenter", function(ev)
        {
            Mouse.InsideCanvas = true;
        });
    },

    Click: function(ev, isRightClick)
    {
        return false;
    },

    CalculateGameCoordinates: function()
    {
        Mouse.CanvasX = Math.round(Game.Canvas.width / Game.Canvas.clientWidth * Mouse.UnscaledCanvasX);
        Mouse.CanvasY = Math.round(Game.Canvas.height / Game.Canvas.clientHeight * Mouse.UnscaledCanvasY);
        Mouse.GameX = Mouse.CanvasX - Game.Scene.Transform.X;
        Mouse.GameY = Mouse.CanvasY - Game.Scene.Transform.Y;
        Mouse.Transform.X = Mouse.GameX;
        Mouse.Transform.Y = Mouse.GameY;
    }
};
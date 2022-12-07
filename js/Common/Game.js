var Game =
{
    Canvas: undefined,
    Context: undefined,
    Scene: undefined,
    Width: undefined,
    Height: undefined,
    Time: { Start: 0, LastTime: 0, DeltaTime: 0, TotalTime: 0 },
    DebugDiv: undefined,

    StartGame: function()
    {
        Game.DebugDiv = document.getElementById('DebugDiv');
        Game.DebugDiv.Refresh = setInterval(function()
        {
            Game.DebugDiv.innerHTML = "Running Time: " + Game.Time.TotalTime + "<br>FPS: " +
                Math.floor(1000/Game.Time.DeltaTime);
        }, 100);

        Game.Canvas = document.getElementById('GameCanvas');
        Game.Context = Game.Canvas.getContext('2d');
        Game.Width = Game.Canvas.width;
        Game.Height = Game.Canvas.height;

        Mouse.Initialize();
        Physics.Initialize();

        Game.Time.Start = new Date().getTime();
        Game.Time.LastTime = Game.Time.Start;

        Game.ChangeScene(new LogoScene());
        Game.Loop();
    },

    Loop: function()
    {
        Game.Time.DeltaTime = new Date().getTime() - Game.Time.LastTime;
        Game.Time.LastTime += Game.Time.DeltaTime;
        Game.Time.TotalTime += Game.Time.DeltaTime;

        Game.Scene.Update(Game.Time);

        Game.Context.clearRect(0, 0, Game.Canvas.width, Game.Canvas.height);
        Game.Scene.Draw(Game.Context, Game.Time);

        Physics.Update(Game.Time);
        Physics.Draw(Game.Context, Game.Time);

        Mouse.CalculateGameCoordinates();

        requestAnimationFrame(Game.Loop, undefined);
    },

    ChangeScene: function(scene, destroyPreviousScene)
    {
        if (destroyPreviousScene)
            Game.Scene.Destroy();

        Game.Scene = scene;
        Game.Scene.Initialize();
        Game.Scene.Test();
    }
};

document.addEventListener("keydown", function(event)
{
    if (event.keyCode == 13) // Enter Key
        toggleFullScreen();
    else if (event.keyCode == 68) // D key
        Physics.Visible = !Physics.Visible;
}, false);

function toggleFullScreen()
{
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
        if (Game.Canvas.requestFullscreen) {
            Game.Canvas.requestFullscreen();
        } else if (Game.Canvas.msRequestFullscreen) {
            Game.Canvas.msRequestFullscreen();
        } else if (Game.Canvas.mozRequestFullScreen) {
            Game.Canvas.mozRequestFullScreen();
        } else if (Game.Canvas.webkitRequestFullscreen) {
            Game.Canvas.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}


window.addEventListener('load',function(e) { //Run this file when the window loads

  // $shape = $("#shape");
  $x = $("#X");
  $y = $('#Y');

  var connection = new signalR.HubConnection("/hubs/client");

  var Q = window.Q = Quintus().include("Sprites, Scenes, 2D, Input")
    .setup({ width: 1000, height: 600 });

  Q.options.imagePath = '/images/';
  Q.gravityY = 0;

  Q.scene("start",function(stage) {

    // A basic sprite shape a asset as the image
    var sprite1 = new Q.Sprite({ x: 500, y: 100, asset: 'enemy.png', 
      angle: 0, collisionMask: 1, scale: 1});
    stage.insert(sprite1);

    // Bind the basic inputs to different behaviors of sprite1
    Q.input.on('up',stage,function(e) { connection.send("UserCommand", "north"); });  // keycode 38:up arrow  
    Q.input.on('down',stage,function(e) { connection.send("UserCommand", "south"); }); // keycode 40:down arrow
    Q.input.on('left',stage,function(e) { connection.send("UserCommand", "west"); }); // keycode 37:left arrow
    Q.input.on('right',stage,function(e) { connection.send("UserCommand", "east"); }); // keycode 39:right arrow
    Q.input.on('fire',stage,function(e) { connection.send("UserCommand", "fire"); }); // keycode 90:z
    Q.input.on('action',stage,function(e) { connection.send("UserCommand", "action"); }); // keycode 88:x  

    connection.on('shapeMoved', function(x, y) {
      $x.html(x);
      $y.html(y);
      sprite1.p.x = x * 100;
      sprite1.p.y = y * 100;
    });

  });
  
  Q.load('enemy.png',function() {
  
    // Start the show
    Q.stageScene("start");
  
    // Turn visual debugging on to see the 
    // bounding boxes and collision shapes
    Q.debug = true;
  
    // Turn on default keyboard controls
    Q.input.keyboardControls();
  });
  
  connection.start()
});

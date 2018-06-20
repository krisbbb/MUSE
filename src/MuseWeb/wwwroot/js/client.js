

window.addEventListener('load',function(e) { //Run this file when the window loads

  // $shape = $("#shape");
  $x = $("#X");
  $y = $('#Y');

  var connection = new signalR.HubConnection("/hubs/client");

  var Q = window.Q = Quintus().include("Sprites, Scenes, 2D, Input")
    .setup({ width: 1000, height: 600 });

  Q.options.imagePath = '/images/';
  Q.gravityY = 0;

  var controls = function(stage) {
    // Bind the basic inputs to send controls to the server
    Q.input.on('up',stage,function(e) { connection.send("UserCommand", "north"); });  // keycode 38:up arrow  
    Q.input.on('down',stage,function(e) { connection.send("UserCommand", "south"); }); // keycode 40:down arrow
    Q.input.on('left',stage,function(e) { connection.send("UserCommand", "west"); }); // keycode 37:left arrow
    Q.input.on('right',stage,function(e) { connection.send("UserCommand", "east"); }); // keycode 39:right arrow
    Q.input.on('fire',stage,function(e) { connection.send("UserCommand", "fire"); }); // keycode 90:z
    Q.input.on('action',stage,function(e) { connection.send("UserCommand", "action"); }); // keycode 88:x  
  };
  
  var sprites = {};
  var image_map = {
    hero: 'hero.png',
    enemy: 'enemy.png',
    wall: 'wall.png',
    bullet: 'bullet.png'
  };

  var main_stage = {};

  connection.on('shapeAdded', function(id, face) {
    // A basic sprite shape a asset as the image

    console.log("shapeAdded(" + id + "," + face + ")")

    var sprite1 = new Q.Sprite({ x: 500, y: 100, asset: 'enemy.png', 
      angle: 0, collisionMask: 1, scale: 1});
    sprites[id] = sprite1;
    main_stage.insert(sprite1);
  });


  connection.on('shapeMoved', function(id, x, y, z) {
    $x.html(x);
    $y.html(y);

    sprite1 = sprites[id];

    sprite1.p.x = x * 100;
    sprite1.p.y = y * 100;
  });


  //Make tile layer - scene

  //Make base sprite class

  //Make player class

  //Follow player in viewport

  //Stage...?

  Q.scene("start",function(stage) {
    main_stage = stage;
    controls(stage);
  });
  
  Q.load('enemy.png',function() {
  
    // Start the show
    Q.stageScene("start");
  
    // Turn visual debugging on to see the 
    // bounding boxes and collision shapes
    Q.debug = true;
  
    // Turn on default keyboard controls
    Q.input.keyboardControls();

    //Start WebSocket to Server
    connection.start()
  });
  
});

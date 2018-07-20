

window.addEventListener('load',function(e) { //Run this file when the window loads

  // $shape = $("#shape");
  $x = $("#X");
  $y = $('#Y');

  var map_scale = 1
  var grid_size = 30
  var grid_to_stage = function(x) {
    return x * grid_size + (grid_size / 2);
  };

  var connection = new signalR.HubConnection("/hubs/client");

  var Q = window.Q = Quintus().include("Sprites, Scenes, 2D, Input")
    .setup({ width: 800, height: 800 });

    Q.options.imagePath = '/images/';
    Q.options.dataPath = '/images/';
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
    player: 'player',
    kobold: 'enemy',
    tower: 'castle',
    //bullet: 'bullet.png'
  };

  var main_stage = {};

  connection.on('newScene', function(scenerySet, data) {

    //console.log("newScene(" + scenerySet + "," + data + ")") //Debug

        // Start the show
        Q.stageScene("start", 0, {sort: true});

        Q.sheet('tiles', 'tiles.png', { tilew: 32, tileh: 32 });
        Q.compileSheets('sprites.png', 'sprites.json');
        
        main_stage.insert(new Q.TileLayer({
          //dataAsset: "tiles.json",
          tiles: data,
          sheet: "tiles"
        }));

        // Turn visual debugging on to see the 
        // bounding boxes and collision shapes
        //Q.debug = true;
    
        // Turn on default keyboard controls
        Q.input.keyboardControls();    
  });

  connection.on('shapeAdded', function(id, face, x, y, z) {
    // A basic sprite shape a asset as the image

    console.log("shapeAdded(" + id + "," + face + "," + x + "," + y + "," + z + ")") //Debug

    var sheet = image_map[face]

    var sprite1 = new Q.Sprite({
      x: grid_to_stage(x), y: grid_to_stage(y), z: z, 
      //asset: 'enemy.png', 
      sheet: sheet,
      angle: 0, collisionMask: 1, 
      scale: map_scale});
    sprites[id] = sprite1;
    main_stage.insert(sprite1);
  });

  connection.on('shapeMoved', function(id, x, y, z) {
    console.log("shapeMoved(" + id + "," + x + "," + y + "," + z + ")") //Debug

    sprite1 = sprites[id];

    stage_x = grid_to_stage(x)
    stage_y = grid_to_stage(y)

    $x.html(x + "(" + stage_x + ")");
    $y.html(y + "(" + stage_y + ")");

    sprite1.p.x = stage_x;
    sprite1.p.y = stage_y;
    sprite1.p.z = z;
  });


  //Make tile layer - scene
  //May be able to set tiles prop directly instead of using dataAsset:
  // tileData <- from server
  // new Q.TileLayer({
  //   tileW: 32,  // Default tile width
  //   tileH: 32,  // Default tile height
  //   blockTileW: 10,  // Default pre-render size
  //   blockTileH: 10,
  //   type: Q.SPRITE_DEFAULT, // Default type (for collisions)
  //   //dataAsset: "tiles.json",
  //   tiles: "tiles.json",
  //   sheet: "tiles"
  // });
  // see quintus_2d.js:199 (load: fn)

  //Make base sprite class

  //Make player class

  //Follow player in viewport

  //Stage...?

  Q.scene("start",function(stage) {
    main_stage = stage;
    controls(stage);
  });
  
  var files = [
    'enemy.png',
    'tiles.png',
    //'arena.json',
    'sprites.png',
    'sprites.json'
  ];
 
  Q.load(files.join(','),function() {  
    //Start WebSocket to Server
    connection.start()
  });
  
});

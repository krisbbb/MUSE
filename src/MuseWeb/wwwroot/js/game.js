  //Make base sprite class

  //Make player class

  //Follow player in viewport

  //var Q = function(imagePath, dataPath, display, image_map)

function CreateGame(connection, display, image_map, image_path, data_path)
{

  //Load config -> do setup
  //Need to break this into multiple functions
  //Can I decouple from connection?  Pass function pointers around?
  //Setup based on config
  //Tell connection we are ready to play - may not have to be connection.start...

  var files = [
    display['images'],
    display['data'],
    display['tiles']
  ];

  var Q = Quintus().include("Sprites, Scenes, 2D, Input")
    .setup({ width: 800, height: 800 }); //How can I connect this with calculations/make it a variable?

    Q.options.imagePath = image_path;
    Q.options.dataPath = data_path;
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

  var main_stage = {};

  connection.on('newScene', function(scenerySet, data) {

    //console.log("newScene(" + scenerySet + "," + data + ")") //Debug

        // Start the show
        Q.stageScene("start", 0, {sort: true});

        Q.sheet('tiles', display['tiles'], { tilew: display['grid_size'], tileh: display['grid_size'] });
        Q.compileSheets(display['images'], display['data']);
        
        main_stage.insert(new Q.TileLayer({
          tiles: data,
          sheet: "tiles"
        }));
    
        // Turn on default keyboard controls
        Q.input.keyboardControls();    
  });
 
  var map_scale = 1
  var grid_to_stage = function(x) {
    return x * display['grid_size'] + (display['grid_size'] / 2);
  };

  connection.on('shapeAdded', function(id, face, x, y, z) {
    // A basic sprite shape a asset as the image
    //console.log("shapeAdded(" + id + "," + face + "," + x + "," + y + "," + z + ")") //Debug

    var sheet = image_map[face]

    var sprite1 = new Q.Sprite({
      x: grid_to_stage(x), y: grid_to_stage(y), z: z, 
      sheet: sheet,
      angle: 0, collisionMask: 1, 
      scale: map_scale});
    sprites[id] = sprite1;
    main_stage.insert(sprite1);
  });

  connection.on('shapeMoved', function(id, x, y, z) {
    //console.log("shapeMoved(" + id + "," + x + "," + y + "," + z + ")") //Debug

    sprite1 = sprites[id];

    stage_x = grid_to_stage(x)
    stage_y = grid_to_stage(y)

    $x.html(x + "(" + stage_x + ")");
    $y.html(y + "(" + stage_y + ")");

    sprite1.p.x = stage_x;
    sprite1.p.y = stage_y;
    sprite1.p.z = z;
  });

  Q.scene("start",function(stage) {
    main_stage = stage;
    controls(stage);
  });
  
  Q.load(files.join(','),function() {  
    //Start WebSocket to Server
    connection.start()
  });

  return Q;
};


console.log("this is the junk test example.")

window.addEventListener('load',function(e) {

  var connection = new signalR.HubConnection("/hubs/client");

  // Set up a standard Quintus instance with only the 
  // Sprites and Scene module (for the stage support) loaded.
  var Q = window.Q = Quintus().include("Sprites, Scenes, 2D, Input")
                            .setup({ width: 1000, height: 600 });

  Q.options.imagePath = '/images/';
  Q.gravityY = 0;

  // Create a simple scene that adds two shapes on the page
  Q.scene("start",function(stage) {

    // A basic sprite shape a asset as the image
    var sprite1 = new Q.Sprite({ x: 500, y: 100, asset: 'enemy.png', 
                                angle: 0, collisionMask: 1, scale: 1});
    sprite1.p.points = [
    [ -150, -120 ],
    [  150, -120 ],
    [  150,   60 ],
    [   90,  120 ],
    [  -90,  120 ],
    [ -150,   60 ]
    ];
    stage.insert(sprite1);
    // Add the 2D component for collision detection and gravity.
    sprite1.add('2d')

    sprite1.on('step',function() {

    });

    // A red platform for the other sprite to land on
    var sprite2 = new Q.Sprite({ x: 500, y: 600, w: 300, h: 200 });
    sprite2.draw= function(ctx) {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(-this.p.cx,-this.p.cy,this.p.w,this.p.h);
    };
    stage.insert(sprite2);
    // Bind the basic inputs to different behaviors of sprite1
    Q.input.on('up',stage,function(e) { 
    //sprite1.p.scale -= 0.1;
    connection.send("UserCommand", "north"); // keycode 38:up arrow
    });

    Q.input.on('down',stage,function(e) { 
    //sprite1.p.scale += 0.1;
    connection.send("UserCommand", "south"); // keycode 40:down arrow
    });

    Q.input.on('left',stage,function(e) {
    //sprite1.p.angle -= 5;
    connection.send("UserCommand", "west"); // keycode 37:left arrow
    });

    Q.input.on('right',stage,function(e) {
    //sprite1.p.angle += 5;
    connection.send("UserCommand", "east"); // keycode 39:right arrow
    });

    Q.input.on('fire',stage,function(e) {
    //sprite1.p.vy = -600;
    connection.send("UserCommand", "fire"); // keycode 90:z
    });

    Q.input.on('action',stage,function(e) {
    // sprite1.p.x = 500;
    // sprite1.p.y = 100;
    connection.send("UserCommand", "action"); // keycode 88:x
    });

    connection.on('shapeMoved', function(x, y) {
    //$shape.css({ left: x * 100, top: y * 100 });
    //$x.html(x);
    //$y.html(y);

    sprite1.p.x = x * 100;
    sprite1.p.y = y * 100;
    });
    
    
      // Draw some lines after each frame
    //   stage.on('postrender',drawLines);
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

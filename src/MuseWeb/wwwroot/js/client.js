

//window.addEventListener('load',function(e) { //Run this file when the window loads
$shape = $("#shape");
$x = $("#X");
$y = $('#Y');

var connection = new signalR.HubConnection("/hubs/client");

// connection.on('shapeMoved', function(x, y) {
//     $shape.css({ left: x * 100, top: y * 100 });
//     $x.html(x);
//     $y.html(y);
// });

// $(document).ready(function() {

//   var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
//   .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
//   .setup({ maximize: true })
//   .enableSound()
//   .controls().touch();

var Q = window.Q = Quintus().include("Sprites, Scenes, 2D, Input")
.setup({ width: 1000, height: 600 });

Q.options.imagePath = '/images/';


Q.gravityY = 0;

      // Bind the basic inputs to different behaviors of sprite1
      Q.input.on('up',stage,function(e) { 
        //sprite1.p.scale -= 0.1;
        connection.send("UserCommand", "north"); //W
      });
  
      Q.input.on('down',stage,function(e) { 
        //sprite1.p.scale += 0.1;
      });
  
      Q.input.on('left',stage,function(e) {
        //sprite1.p.angle -= 5;
      });
  
      Q.input.on('right',stage,function(e) {
        //sprite1.p.angle += 5;
      });
  
      Q.input.on('fire',stage,function(e) {
        //sprite1.p.vy = -600;
      });
  
      Q.input.on('action',stage,function(e) {
        // sprite1.p.x = 500;
        // sprite1.p.y = 100;
      });
  

// Q.Sprite.extend('Player', {
//   init: function (p) {
//     this._super(p, {
//       sheet: 'player'
//     });

//     this.add('2d, platformerControls, animation');
//   },
//   step: function (dt) {
//     if (Q.inputs['up']) {
//       this.p.vy = -200;
//     } else if (Q.inputs['down']) {
//       this.p.vy = 200;
//     } else if (!Q.inputs['down'] && !Q.inputs['up']) {
//       this.p.vy = 0;
//     }
//   }
// });

var files = [
    '/images/tiles.png',
    '/js/arena.json',
    '/images/sprites.png',
    '/images/sprites.json'
  ];
 
  Q.load(files.join(','), function () {
    Q.sheet('tiles', '/images/tiles.png', { tilew: 32, tileh: 32 });
    Q.compileSheets('/images/sprites.png', '/images/sprites.json');
    Q.stageScene('arena', 0);
  });


      //$(document).on("keypress", keyPressHandler)
  connection.start()
});

//   function keyPressHandler(e){
//       if(e.keyCode === 119)
//       {
//           connection.send("UserCommand", "north"); //W
//       }
//       if(e.keyCode === 97)
//       {
//           connection.send("UserCommand", "west"); //A
//       }
//       if(e.keyCode === 115)
//       {
//           connection.send("UserCommand", "south"); //S
//       }
//       if(e.keyCode === 100)
//       {
//           connection.send("UserCommand", "east"); //D
//       }
//   }

//});
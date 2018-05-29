

//window.addEventListener('load',function(e) { //Run this file when the window loads
$shape = $("#shape");
$x = $("#X");
$y = $('#Y');

var connection = new signalR.HubConnection("/hubs/client");

connection.on('shapeMoved', function(x, y) {
    $shape.css({ left: x * 100, top: y * 100 });
    $x.html(x);
    $y.html(y);
});

$(document).ready(function() {

  var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
  .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
  .setup({ maximize: true })
  .enableSound()
  .controls().touch();

Q.gravityY = 0;

Q.Sprite.extend('Player', {
  init: function (p) {
    this._super(p, {
      sheet: 'player'
    });

    this.add('2d, platformerControls, animation');
  },
  step: function (dt) {
    if (Q.inputs['up']) {
      this.p.vy = -200;
    } else if (Q.inputs['down']) {
      this.p.vy = 200;
    } else if (!Q.inputs['down'] && !Q.inputs['up']) {
      this.p.vy = 0;
    }
  }
});

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
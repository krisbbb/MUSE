
console.log("this is the tag example.")


var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
      .setup({ maximize: true })
      .enableSound()
      .controls().touch();
 
Q.gravityY = 0;
 
// var objectFiles = [
//   './src/player'
// ];
 
//require(objectFiles, 
function TagSetupArena (Q) {
  TagSetupPlayer(Q);
  Q.scene('arena', function (stage) {
    stage.collisionLayer(new Q.TileLayer({ dataAsset: '/maps/arena.json', sheet: 'tiles' }));
 
    var player = stage.insert(new Q.Player({ x: 100, y: 100 }));
    stage.add('viewport').follow(player);
  });
 
  var files = [
    '/images/tiles.png',
    '/js/example/arena.json',
    '/images/sprites.png',
    '/images/sprites.json'
  ];
 
  Q.load(files.join(','), function () {
    Q.sheet('tiles', '/images/tiles.png', { tilew: 32, tileh: 32 });
    Q.compileSheets('/images/sprites.png', '/images/sprites.json');
    Q.stageScene('arena', 0);
  });
};

TagSetupArena(Q);

console.log("end of the tag example.")


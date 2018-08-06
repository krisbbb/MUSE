window.addEventListener('load',function(e) { //Run this file when the window loads

  // $shape = $("#shape");
  $x = $("#X");
  $y = $('#Y');

  var connection = new signalR.HubConnection("/hubs/client");
  var image_path = '/simple_game/display/';
  var data_path = '/simple_game/display/';

  var display = {
    images: 'sprites.png',
    data: 'sprites.json',
    tiles: 'tiles.png',
    grid_size: 32
  }
  //var Q = window.Q = Quintus().include("Sprites, Scenes, 2D, Input")
  var image_map = {
    player: 'player',
    kobold: 'enemy',
    tower: 'castle',
  };

  window.Q = CreateGame(connection, display, image_map, image_path, data_path);
});

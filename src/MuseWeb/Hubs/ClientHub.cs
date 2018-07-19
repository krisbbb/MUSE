using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Muse;
using MuseWeb.Services;

namespace MuseWeb.Hubs
{
    [Authorize]
    public class ClientHub : Hub
    {
        private INotifyService<ClientHub> _notify;
        public ClientHub(INotifyService<ClientHub> notify)
        {
            _notify = notify;
        }

        public static Game game = null;
        public static string gamedata = "dir/";

        //Game connection, not hub connection
        public static Connection connection = null;

        public override async Task OnConnectedAsync()
        {
            if (game == null)
            {
                game = new Game(gamedata + "basicgame");
                //game.Start();
            }

            connection = new Connection(Context.User.Identity.Name);
            var connectionId = Context.ConnectionId;
            connection.NewScene += async (s, e) => await _notify.SendToOneClientAsync(connectionId, "newScene", e.Scenery, e.SceneData);
            connection.NewShape += async (s, e) => await _notify.SendToOneClientAsync(connectionId, "shapeAdded", e.ShapeId, e.Shape, e.X, e.Y, e.Z);
            connection.ShapeMoved += async (s, e) => await _notify.SendToOneClientAsync(connectionId, "shapeMoved", e.ShapeId, e.X, e.Y, e.Z);

            await Task.Run(() => game.Connect(connection));
        }

        public async Task UserCommand(string command)
        {
            connection.OnAction(command, null);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            Console.WriteLine(String.Format("disconnected."));
            await Clients.All.SendAsync("SendAction", Context.User.Identity.Name, "left");
        }
    }
}
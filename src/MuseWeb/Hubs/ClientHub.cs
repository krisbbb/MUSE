using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Muse;

namespace MuseWeb.Hubs
{
    [Authorize]
    public class ClientHub : Hub
    {
        public static int x = 1;
        public static int y = 1;

        public static int z = 5;

        public static Game game = null;
        public static string gamedata = "dir/";
        public static Connection connection = null;

        public static string connectionId;

        public static IClientProxy hubConnection = null;

        public override async Task OnConnectedAsync()
        {
            //await Clients.All.SendAsync("SendAction", Context.User.Identity.Name, "joined");
            connectionId = Context.ConnectionId;
            Console.WriteLine(String.Format("Got connectionId {0}.", connectionId));

            if (game == null)
            {
                game = new Game(gamedata + "basicgame");
            }

            var hubConnection = Clients.Caller;

            connection = new Connection(Context.User.Identity.Name);
            connection.NewScene += async (s, e) => await NewScene(connectionId, e.Scenery, e.SceneData);
            connection.NewShape += async (s, e) => await ShapeAdded(connectionId, e.ShapeId, e.Shape, e.X, e.Y, e.Z);
            connection.ShapeMoved += async (s, e) => await ShapeMoved(connectionId, e.ShapeId, e.X, e.Y, e.Z);

            //Clients.Caller

            game.Connect(connection);

            //var playerid = 0;
            //await Clients.Caller.SendAsync("shapeAdded", playerid, "player", x, y, z);
            // await Clients.Caller.SendAsync("shapeAdded", 2, "orc", 3, 3, 1);
            // await Clients.Caller.SendAsync("shapeAdded", 3, "kobold", 5, 5, 1);
            //await Clients.Caller.SendAsync("shapeMoved", playerId, x, y, z);
        }

        private async Task NewScene(string connectionId, string scenery, int[,] sceneData)
        {
            await Clients.Client(connectionId).SendAsync("newScene", scenery, sceneData);
        }

        private async Task ShapeAdded(string connectionId, int shapeId, string shape, int x, int y, int z)
        {
            await Clients.Client(connectionId).SendAsync("shapeAdded", shapeId, shape, x, y, z);
        }

        private async Task ShapeMoved(string connectionId, int shapeId, int x, int y, int z)
        {
            // Console.WriteLine(String.Format("Trying connection id {0}.", connectionId));
            // await Clients.Client(connectionId).SendAsync("shapeMoved", shapeId, x, y, z);
            Console.WriteLine(String.Format("Trying saved connection."));
            await hubConnection.SendAsync("shapeMoved", shapeId, x, y, z);
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

        // public async Task Send(string message)
        // {
        //     await Clients.All.SendAsync("SendMessage", Context.User.Identity.Name, message);
        // }

        // public async Task UserCommand(string command)
        // {
        //     int min = 1;
        //     int max = 15;

        //     Console.WriteLine(String.Format("got command ({0})", command));
        //     switch(command)
        //     {
        //         case "north":
        //             y = Math.Max(min, y - 1);
        //         break;
        //         case "south":
        //             y = Math.Min(max, y + 1);
        //         break;
        //         case "east":
        //             x = Math.Min(max, x + 1);
        //         break;
        //         case "west":
        //             x = Math.Max(min, x - 1);
        //         break;
        //         default:
        //         break;
        //     }

        //     int playerId = 0;
        //     await Clients.Caller.SendAsync("shapeMoved", playerId, x, y, z);
        // }
    }
}
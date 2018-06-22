using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MuseWeb.Hubs
{
    [Authorize]
    public class ClientHub : Hub
    {
        public static int x = 0;
        public static int y = 0;

        public override async Task OnConnectedAsync()
        {
            //await Clients.All.SendAsync("SendAction", Context.User.Identity.Name, "joined");

            var scenery = "basic";
            var data = "[[0101010],[0000000],[0000000000],[010101010101]]";

            await Clients.Caller.SendAsync("newScene", scenery, data);

            var playerid = 0;
            int z = 0;
            await Clients.Caller.SendAsync("shapeAdded", playerid, "player", x, y, z);

            await Clients.Caller.SendAsync("shapeAdded", 2, "orc", 3, 3, 1);
            await Clients.Caller.SendAsync("shapeAdded", 3, "kobold", 5, 5, 1);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await Clients.All.SendAsync("SendAction", Context.User.Identity.Name, "left");
        }

        // public async Task Send(string message)
        // {
        //     await Clients.All.SendAsync("SendMessage", Context.User.Identity.Name, message);
        // }

        public async Task UserCommand(string command)
        {
            int max = 16;

            Console.WriteLine(String.Format("got command ({0})", command));
            switch(command)
            {
                case "north":
                    y = Math.Max(0, y - 1);
                break;
                case "south":
                    y = Math.Min(max, y + 1);
                break;
                case "east":
                    x = Math.Min(max, x + 1);
                break;
                case "west":
                    x = Math.Max(0, x - 1);
                break;
                default:
                break;
            }

            int playerId = 0;
            int z = 1;
            await Clients.Caller.SendAsync("shapeMoved", playerId, x, y, z);
        }
    }
}
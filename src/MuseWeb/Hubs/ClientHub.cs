using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MuseWeb.Hubs
{
    [Authorize]
    public class ClientHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            //await Clients.All.SendAsync("SendAction", Context.User.Identity.Name, "joined");
            var playerid = 0;
            await Clients.Caller.SendAsync("shapeAdded", playerid, "face");
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await Clients.All.SendAsync("SendAction", Context.User.Identity.Name, "left");
        }

        // public async Task Send(string message)
        // {
        //     await Clients.All.SendAsync("SendMessage", Context.User.Identity.Name, message);
        // }

        public static int x = 0;
        public static int y = 0;

        public async Task UserCommand(string command)
        {
            Console.WriteLine(String.Format("got command ({0})", command));
            switch(command)
            {
                case "north":
                    y = Math.Max(0, y - 1);
                break;
                case "south":
                    y = Math.Min(8, y + 1);
                break;
                case "east":
                    x = Math.Min(8, x + 1);
                break;
                case "west":
                    x = Math.Max(0, x - 1);
                break;
                default:
                break;
            }

            await Clients.All.SendAsync("shapeMoved", x, y);
        }
    }
}
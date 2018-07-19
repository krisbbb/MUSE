using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MuseWeb.Hubs;

namespace MuseWeb.Services
{
    public interface INotifyService
    {
        Task SendToOneClientAsync(string clientId, string message, params object[] args);
    }

    public class NotifyService : INotifyService
    {
        private IHubContext<ClientHub> _hub;

        public NotifyService(IHubContext<ClientHub> hub)
        {
            _hub = hub;
        }

        public Task SendToOneClientAsync(string clientId, string message, params object[] args)
        {
            switch(args.Length)
            {
                case 0:
                    return _hub.Clients.Client(clientId).SendAsync(message);
                case 1:
                    return _hub.Clients.Client(clientId).SendAsync(message, args[0]);
                case 2:
                    return _hub.Clients.Client(clientId).SendAsync(message, args[0], args[1]);
                case 3:
                    return _hub.Clients.Client(clientId).SendAsync(message, args[0], args[1], args[2]);
                case 4:
                    return _hub.Clients.Client(clientId).SendAsync(message, args[0], args[1], args[2], args[3]);
                case 5:
                    return _hub.Clients.Client(clientId).SendAsync(message, args[0], args[1], args[2], args[3], args[4]);
                case 6:
                    return _hub.Clients.Client(clientId).SendAsync(message, args[0], args[1], args[2], args[3], args[4], args[5]);
                case 7:
                    return _hub.Clients.Client(clientId).SendAsync(message, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                case 8:
                    return _hub.Clients.Client(clientId).SendAsync(message, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
                case 9:
                    return _hub.Clients.Client(clientId).SendAsync(message, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
            }

            throw new InvalidOperationException(string.Format("Too many args: {0}", args.Length));
        }
    }
}

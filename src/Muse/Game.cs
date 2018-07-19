using System;
using System.Collections.Generic;

namespace Muse
{
    public class Game
    {
        public Game(string assetDir) : this(new Assets(assetDir))
        {
        }

        public Game(IAssets someAssets)
        {
            connections = (IDictionary<int, IConnection>) new Dictionary<int,IConnection>();
            assets = someAssets;
        }

        public void Connect(IConnection connection)
        {
            connections[playerId] = connection;
            connection.Action += (s, e) => UserCommand(e.Action, e.TargetId);
            connection.OnNewScene(assets.SceneryId(mapId), assets.MapData(mapId));
            connection.OnNewShape(playerId, "player", x, y, 5);
            connection.OnNewShape( objectId++, "orc", 3, 3, 1);
            connection.OnNewShape( objectId++, "kobold", 5, 5, 1);
        }

        public void Tick()
        {
            connections[playerId].OnShapeMoved(playerId, x, y, 5);
        }

        //private

        int objectId = 1;

        private int mapId = 1;
        private IAssets assets { get; set; }
        private IDictionary<int, IConnection> connections { get; set; }

        private int playerId = 0;
        private int x = 1;
        private int y = 1;

        private void UserCommand(string command, int? targetId)
        {
            int min = 1;
            int max = 15;

            switch(command)
            {
                case "north":
                    y = Math.Max(min, y - 1);
                break;
                case "south":
                    y = Math.Min(max, y + 1);
                break;
                case "east":
                    x = Math.Min(max, x + 1);
                break;
                case "west":
                    x = Math.Max(min, x - 1);
                break;
                default:
                break;
            }

            if(assets.Synchronous)
            {
                Tick();
            }
        }

    }
}

using System;

namespace Muse
{
    public interface IAssets
    {
        string SceneryId(int mapId);
        int [,] MapData(int mapId);
        bool Synchronous { get; }
    }
}

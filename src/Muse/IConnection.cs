using System;

namespace Muse
{
    public interface IConnection
    {
        event EventHandler<NewSceneEventArgs> NewScene;
        void OnNewScene(string scenery, int[,] data);
        event EventHandler<NewShapeEventArgs> NewShape;
        void OnNewShape(int shapeId, string shape, int x, int y, int z);
        event EventHandler<ShapeLocationEventArgs> ShapeMoved;
        void OnShapeMoved(int shapeId, int x, int y, int z);
        event EventHandler<ShapeEventArgs> ShapeRemoved;
        void OnShapeRemoved(int shapeId);
        event EventHandler<ActionEventArgs> Action;
        void OnAction(string action, int? targetId);
    }

    public class NewSceneEventArgs : EventArgs
    {
        public string Scenery { get; set; }
        public int[,] SceneData { get; set; }
    }

    public class ShapeEventArgs : EventArgs
    {
        public int ShapeId { get; set; }
    }

    public class ShapeLocationEventArgs : ShapeEventArgs
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
    }

    public class NewShapeEventArgs : ShapeLocationEventArgs
    {
        public string Shape { get; set; }
    }

    public class ActionEventArgs : EventArgs
    {
        public string Action { get; set; }
        public int? TargetId { get; set; }
    }
}

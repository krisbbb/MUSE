using System;

namespace Muse
{
    public class Connection : IConnection
    {
        public Connection(string playerId)
        {
            Console.WriteLine(String.Format("loading player data for ({0})", playerId));
        }

        public event EventHandler<NewSceneEventArgs> NewScene;
        public void OnNewScene(string scenery, int[,] data) => 
            NewScene.Raise(this, new NewSceneEventArgs { Scenery = scenery, SceneData = data });

        public event EventHandler<NewShapeEventArgs> NewShape;
        public void OnNewShape(int shapeId, string shape, int x, int y, int z) => 
            NewShape.Raise(this, new NewShapeEventArgs { ShapeId = shapeId, Shape = shape, X = x, Y = y, Z = z });
        
        public event EventHandler<ShapeLocationEventArgs> ShapeMoved;
        public void OnShapeMoved(int shapeId, int x, int y, int z) =>
            ShapeMoved.Raise(this, new ShapeLocationEventArgs { ShapeId = shapeId, X = x, Y = y, Z = z });

        public event EventHandler<ShapeEventArgs> ShapeRemoved;
        public void OnShapeRemoved(int shapeId) =>
            ShapeRemoved.Raise(this, new ShapeEventArgs { ShapeId = shapeId });

        
        public event EventHandler<ActionEventArgs> Action;
        public void OnAction(string action, int? targetId) =>
            Action.Raise(this, new ActionEventArgs { Action = action, TargetId = targetId });
    }
}

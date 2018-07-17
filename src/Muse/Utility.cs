using System;

namespace Muse
{
    public static class ExtensionMethods
    {
        public static void Raise<T>(this EventHandler<T> thisEvent, object sender, T args) where T : EventArgs
        {
            if(thisEvent != null)
            {
                thisEvent(sender, args);
            }
        }
    }
}
using System;
using System.Text;

namespace PostIt.Common.Utils;

public static class RandomNumberHelper
{
    public static string Generate(int length = 6)
    {
        Random random = new();
        StringBuilder sb = new(length);
        for (int i = 0; i < length; i++)
        {
            sb.Append(random.Next(1, 9));
        }
        return sb.ToString();
    }
}
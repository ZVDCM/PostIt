using System;

namespace PostIt.Common.Utils;

public static class DateTimeHelper
{
    public static DateTime? ConvertNbfSecondsToDateTime(string nbf)
    {
        if (!long.TryParse(nbf, out long longNbf)) return null;
        DateTime date = DateTimeOffset.FromUnixTimeSeconds(longNbf).Date;
        return date;
    }
}
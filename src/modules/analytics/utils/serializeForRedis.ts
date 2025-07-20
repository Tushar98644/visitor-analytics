export const serializeForRedis = (data: Record<string, unknown>): Record<string, string> => {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : String(value);
      return acc;
    }, {} as Record<string, string>);
}  
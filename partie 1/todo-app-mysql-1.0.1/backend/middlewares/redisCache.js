const { getRedisClient, isRedisConnected } = require('../config/redis');
 
const CACHE_EXPIRATION = 3600; //1 heure
 
const redisCache = {
  async cacheMiddleware(req, res, next) {
    if (req.method !== 'GET') {
      return next();
    }
 
    const redisClient = getRedisClient();
    if (!redisClient || !isRedisConnected()) {
      console.warn('Redis not connected, skipping cache.');
      return next();
    }
 
    const key = `cache:${req.originalUrl}`;
 
    try {
      const cachedResponse = await redisClient.get(key);
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }
 
      //Garde le JSON de base
      const originalJson = res.json;
 
      res.json = function (data) {
        try {
          redisClient.setEx(key, CACHE_EXPIRATION, JSON.stringify(data));
        } catch (err) {
          console.error('Redis setEx error:', err);
        }
        return originalJson.call(this, data);
      };
 
      next();
    } catch (error) {
      console.error('Redis Cache Error:', error);
      next();
    }
  },
 
  //Pour invalider le cache
  async invalidateCache(req, res, next) {
    if (req.method === 'GET') {
      return next();
    }
 
    const redisClient = getRedisClient();
    if (!redisClient || !isRedisConnected()) {
      console.warn('Redis not connected, skipping cache invalidation.');
      return next();
    }
 
    try {
      //Aller chercher toutes les bonnes clefs
      const keys = await redisClient.keys('cache:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      next();
    } catch (error) {
      console.error('Redis Cache Invalidation Error:', error);
      next();
    }
  }
};
 
module.exports = redisCache;
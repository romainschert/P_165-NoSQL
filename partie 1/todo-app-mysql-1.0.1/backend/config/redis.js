const { createClient } = require('redis');
 
let redisClient;
let redisConnected = false;
 
const connectRedis = async (app) => {
  console.log('Attempting to connect to Redis...');
 
  if (redisConnected) {
    console.log('Redis client already connected.');
    return redisClient;
  }
 
  redisClient = createClient({
    url: 'redis://localhost:6379', //Le port de docker
    password: 'admin'
  });
 
  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
    redisConnected = false; //Met a jour le status
  });
 
  redisClient.on('connect', () => {
    console.log('Redis Client Connected Successfully');
    redisConnected = true;
  });
 
  redisClient.on('end', () => {
    console.log('Redis Client Disconnected');
    redisConnected = false;
  });
 
  redisClient.on('ready', () => {
    console.log('Redis Client Ready');
  });
 
  try {
    console.log('Initiating Redis connection...');
    await redisClient.connect();
    console.log('Redis connection established');
   
    // Test the connection
    await redisClient.ping();
    console.log('Redis PING successful');
   
    // Store the client in app.locals
    if (app) {
      app.locals.redisClient = redisClient;
      console.log('Redis client stored in app.locals');
    } else {
      console.warn('No app instance provided to store Redis client');
    }
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    throw err; // Re-throw the error to handle it in the application
  }
  return redisClient;
};
 
const getRedisClient = () => {
  if (!redisClient || !redisConnected) {
    console.warn('Redis client not connected or not initialized!');
  }
  return redisClient;
};
 
module.exports = {
  connectRedis,
  getRedisClient,
  isRedisConnected: () => redisConnected
};
 
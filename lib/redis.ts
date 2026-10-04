import "dotenv/config";
import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
  pub?: Redis;
  sub?: Redis;
};

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  });

export const pubClient =
  globalForRedis.pub ??
  new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  });

export const subClient =
  globalForRedis.sub ??
  new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
  globalForRedis.pub = pubClient;
  globalForRedis.sub = subClient;
}
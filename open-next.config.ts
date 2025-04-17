import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // 默认使用内存缓存，不需要R2存储桶
});
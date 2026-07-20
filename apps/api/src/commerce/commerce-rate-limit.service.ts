import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

type Bucket = {
  count: number;
  resetsAt: number;
};

@Injectable()
export class CommerceRateLimitService {
  private static readonly maximumBuckets = 100_000;
  private readonly buckets = new Map<string, Bucket>();

  consume(key: string, limit: number, windowMilliseconds: number, now = Date.now()): void {
    const existing = this.buckets.get(key);

    if (!existing || existing.resetsAt <= now) {
      if (this.buckets.size >= CommerceRateLimitService.maximumBuckets) {
        this.prune(now);
      }

      if (this.buckets.size >= CommerceRateLimitService.maximumBuckets) {
        throw new HttpException("Too many commerce requests", HttpStatus.TOO_MANY_REQUESTS);
      }

      this.buckets.set(key, { count: 1, resetsAt: now + windowMilliseconds });
      this.prune(now);
      return;
    }

    if (existing.count >= limit) {
      throw new HttpException("Too many commerce requests", HttpStatus.TOO_MANY_REQUESTS);
    }

    existing.count += 1;
  }

  private prune(now: number): void {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetsAt <= now) {
        this.buckets.delete(key);
      }
    }
  }
}

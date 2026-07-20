import assert from "node:assert/strict";
import { ForbiddenException } from "@nestjs/common";
import { test } from "node:test";
import type { CartService } from "../../src/commerce/cart.service";
import type { CommerceBffProofService } from "../../src/commerce/commerce-bff-proof.service";
import type { CommerceRateLimitService } from "../../src/commerce/commerce-rate-limit.service";
import { PublicCartController } from "../../src/commerce/public-cart.controller";

test("rejected BFF proof stops Cart create before rate limiting or mutation", async () => {
  let mutations = 0;
  let rateChecks = 0;
  const controller = new PublicCartController(
    {
      createOrResolve: async () => {
        mutations += 1;
      },
    } as unknown as CartService,
    {
      consume: () => {
        rateChecks += 1;
      },
    } as unknown as CommerceRateLimitService,
    {
      assertTrustedMutation: () => {
        throw new ForbiddenException("Commerce request forbidden");
      },
    } as unknown as CommerceBffProofService,
  );

  await assert.rejects(
    controller.createOrResolve(
      {
        host: "127.0.0.1:4015",
        "x-fardad-cart-token": "0123456789abcdef0123456789abcdef0123456789a",
      },
      "127.0.0.1",
    ),
    /Commerce request forbidden/,
  );
  assert.equal(rateChecks, 0);
  assert.equal(mutations, 0);
});

import { randomUUID } from "node:crypto";
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpCode,
  Ip,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { env } from "../config";
import { parseExpectedRevision } from "./cart-policy";
import { CartService } from "./cart.service";
import { assertCartToken, assertOperationKey, digestToHex, hashCartToken } from "./cart-token";
import {
  commerceBffHeaders,
  CommerceBffProofService,
  type CommerceBffProofInput,
} from "./commerce-bff-proof.service";
import { invalidCommerceRequest } from "./commerce-errors";
import { CommerceRateLimitService } from "./commerce-rate-limit.service";
import { AddCartLineDto } from "./dto/add-cart-line.dto";
import { CartLineParamsDto } from "./dto/cart-line.params.dto";
import { SetCartLineQuantityDto } from "./dto/set-cart-line-quantity.dto";

const cartTokenHeader = "x-fardad-cart-token";

@Controller("public/cart")
export class PublicCartController {
  constructor(
    private readonly cartService: CartService,
    private readonly commerceRateLimit: CommerceRateLimitService,
    private readonly commerceBffProof: CommerceBffProofService,
  ) {}

  @Post()
  @HttpCode(204)
  @Header("Cache-Control", "private, no-store")
  async createOrResolve(
    @Headers() requestHeaders: Record<string, string | string[] | undefined>,
    @Ip() ip: string,
  ): Promise<void> {
    const tokenHeader = getHeader(requestHeaders, cartTokenHeader);
    this.assertTrustedMutation(requestHeaders, {
      body: "",
      method: "POST",
      path: "/public/cart",
      token: tokenHeader,
    });
    const token = parseToken(tokenHeader);
    this.commerceRateLimit.consume(`cart-create:${env.COMMERCE_STORE_KEY}:${ip}`, 20, 60_000);
    await this.cartService.createOrResolve(token, randomUUID());
  }

  @Get()
  @Header("Cache-Control", "private, no-store")
  getCart(@Headers(cartTokenHeader) tokenHeader: string | undefined, @Ip() ip: string) {
    const token = parseToken(tokenHeader);
    this.consumeCartRate("read", token, ip, 120);
    return this.cartService.getCart(token);
  }

  @Post("lines")
  @HttpCode(204)
  @Header("Cache-Control", "private, no-store")
  async addLine(
    @Headers() requestHeaders: Record<string, string | string[] | undefined>,
    @Body() body: AddCartLineDto,
    @Ip() ip: string,
  ): Promise<void> {
    const tokenHeader = getHeader(requestHeaders, cartTokenHeader);
    const ifMatch = getHeader(requestHeaders, "if-match");
    const idempotencyKeyHeader = getHeader(requestHeaders, "idempotency-key");
    this.assertTrustedMutation(requestHeaders, {
      body: JSON.stringify({ productSlug: body.productSlug, quantity: body.quantity }),
      idempotencyKey: idempotencyKeyHeader,
      ifMatch,
      method: "POST",
      path: "/public/cart/lines",
      token: tokenHeader,
    });
    const headers = parseMutationHeaders(tokenHeader, ifMatch, idempotencyKeyHeader);
    this.consumeCartRate("mutation", headers.token, ip, 60);
    await this.cartService.addLine(
      headers.token,
      body.productSlug,
      body.quantity,
      headers.revision,
      headers.idempotencyKey,
      randomUUID(),
    );
  }

  @Patch("lines/:lineReference")
  @HttpCode(204)
  @Header("Cache-Control", "private, no-store")
  async setLineQuantity(
    @Param() params: CartLineParamsDto,
    @Headers() requestHeaders: Record<string, string | string[] | undefined>,
    @Body() body: SetCartLineQuantityDto,
    @Ip() ip: string,
  ): Promise<void> {
    const tokenHeader = getHeader(requestHeaders, cartTokenHeader);
    const ifMatch = getHeader(requestHeaders, "if-match");
    const idempotencyKeyHeader = getHeader(requestHeaders, "idempotency-key");
    this.assertTrustedMutation(requestHeaders, {
      body: JSON.stringify({ quantity: body.quantity }),
      idempotencyKey: idempotencyKeyHeader,
      ifMatch,
      method: "PATCH",
      path: `/public/cart/lines/${encodeURIComponent(params.lineReference)}`,
      token: tokenHeader,
    });
    const headers = parseMutationHeaders(tokenHeader, ifMatch, idempotencyKeyHeader);
    this.consumeCartRate("mutation", headers.token, ip, 60);
    await this.cartService.setLineQuantity(
      headers.token,
      params.lineReference,
      body.quantity,
      headers.revision,
      headers.idempotencyKey,
      randomUUID(),
    );
  }

  @Delete("lines/:lineReference")
  @HttpCode(204)
  @Header("Cache-Control", "private, no-store")
  async removeLine(
    @Param() params: CartLineParamsDto,
    @Headers() requestHeaders: Record<string, string | string[] | undefined>,
    @Ip() ip: string,
  ): Promise<void> {
    const tokenHeader = getHeader(requestHeaders, cartTokenHeader);
    const ifMatch = getHeader(requestHeaders, "if-match");
    const idempotencyKeyHeader = getHeader(requestHeaders, "idempotency-key");
    this.assertTrustedMutation(requestHeaders, {
      body: "",
      idempotencyKey: idempotencyKeyHeader,
      ifMatch,
      method: "DELETE",
      path: `/public/cart/lines/${encodeURIComponent(params.lineReference)}`,
      token: tokenHeader,
    });
    const headers = parseMutationHeaders(tokenHeader, ifMatch, idempotencyKeyHeader);
    this.consumeCartRate("mutation", headers.token, ip, 60);
    await this.cartService.removeLine(
      headers.token,
      params.lineReference,
      headers.revision,
      headers.idempotencyKey,
      randomUUID(),
    );
  }

  @Post("quote/refresh")
  @HttpCode(204)
  @Header("Cache-Control", "private, no-store")
  async refreshQuote(
    @Headers() requestHeaders: Record<string, string | string[] | undefined>,
    @Ip() ip: string,
  ): Promise<void> {
    const tokenHeader = getHeader(requestHeaders, cartTokenHeader);
    const ifMatch = getHeader(requestHeaders, "if-match");
    const idempotencyKeyHeader = getHeader(requestHeaders, "idempotency-key");
    this.assertTrustedMutation(requestHeaders, {
      body: "",
      idempotencyKey: idempotencyKeyHeader,
      ifMatch,
      method: "POST",
      path: "/public/cart/quote/refresh",
      token: tokenHeader,
    });
    const headers = parseMutationHeaders(tokenHeader, ifMatch, idempotencyKeyHeader);
    this.consumeCartRate("quote-refresh", headers.token, ip, 12);
    await this.cartService.refreshQuote(
      headers.token,
      headers.revision,
      headers.idempotencyKey,
      randomUUID(),
    );
  }

  private consumeCartRate(scope: string, token: string, ip: string, limit: number): void {
    const tokenKey = digestToHex(hashCartToken(token));
    this.commerceRateLimit.consume(
      `${scope}:${env.COMMERCE_STORE_KEY}:${tokenKey}:${ip}`,
      limit,
      60_000,
    );
  }

  private assertTrustedMutation(
    requestHeaders: Record<string, string | string[] | undefined>,
    input: Pick<CommerceBffProofInput, "body" | "method" | "path" | "token"> &
      Partial<Pick<CommerceBffProofInput, "idempotencyKey" | "ifMatch">>,
  ): void {
    this.commerceBffProof.assertTrustedMutation({
      ...input,
      host: getHeader(requestHeaders, "host"),
      idempotencyKey: input.idempotencyKey,
      ifMatch: input.ifMatch,
      nonce: getHeader(requestHeaders, commerceBffHeaders.nonce),
      origin: getHeader(requestHeaders, "origin"),
      signature: getHeader(requestHeaders, commerceBffHeaders.signature),
      timestamp: getHeader(requestHeaders, commerceBffHeaders.timestamp),
    });
  }
}

function getHeader(
  headers: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const value = headers[name];
  return typeof value === "string" ? value : undefined;
}

function parseToken(value: string | undefined): string {
  try {
    return assertCartToken(value);
  } catch {
    throw invalidCommerceRequest();
  }
}

function parseMutationHeaders(
  tokenHeader: string | undefined,
  ifMatch: string | undefined,
  idempotencyKeyHeader: string | undefined,
): { idempotencyKey: string; revision: number; token: string } {
  try {
    return {
      idempotencyKey: assertOperationKey(idempotencyKeyHeader),
      revision: parseExpectedRevision(ifMatch),
      token: assertCartToken(tokenHeader),
    };
  } catch {
    throw invalidCommerceRequest();
  }
}

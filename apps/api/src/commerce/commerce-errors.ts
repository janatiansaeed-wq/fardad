import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";

export type CommerceErrorCode =
  | "CART_EXPIRED"
  | "CART_LIMIT_REACHED"
  | "CART_REVISION_CONFLICT"
  | "IDEMPOTENCY_CONFLICT"
  | "PRODUCT_UNAVAILABLE"
  | "QUANTITY_NOT_ALLOWED"
  | "QUOTE_CHANGED";

export function invalidCommerceRequest(): BadRequestException {
  return new BadRequestException("Invalid commerce request");
}

export function productNotFound(): NotFoundException {
  return new NotFoundException("Product not found");
}

export function cartNotFound(): NotFoundException {
  return new NotFoundException("Cart not found");
}

export function commerceConflict(
  code: Extract<
    CommerceErrorCode,
    "CART_REVISION_CONFLICT" | "IDEMPOTENCY_CONFLICT" | "QUOTE_CHANGED"
  >,
): ConflictException {
  return new ConflictException({ code, message: "Commerce request conflict" });
}

export function commerceUnprocessable(
  code: Extract<
    CommerceErrorCode,
    "CART_EXPIRED" | "CART_LIMIT_REACHED" | "PRODUCT_UNAVAILABLE" | "QUANTITY_NOT_ALLOWED"
  >,
): UnprocessableEntityException {
  return new UnprocessableEntityException({
    code,
    message: "Commerce request could not be applied",
  });
}

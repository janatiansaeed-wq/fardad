import { Injectable } from "@nestjs/common";
import { ProductDataQualityService } from "./product-data-quality.service";
import { ProductDataQualityResult } from "./product-data-quality.types";

@Injectable()
export class ProductService {
  constructor(private readonly productDataQualityService: ProductDataQualityService) {}

  getDataQuality(productId: string): Promise<ProductDataQualityResult> {
    return this.productDataQualityService.evaluate(productId);
  }
}

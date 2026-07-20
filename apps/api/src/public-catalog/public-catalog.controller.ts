import { Controller, Get, Param, Query } from "@nestjs/common";
import { PublicCatalogPageQueryDto } from "./dto/public-catalog-page-query.dto";
import { PublicCategorySlugParamsDto } from "./dto/public-category-slug.params.dto";
import { PublicCatalogService } from "./public-catalog.service";

@Controller("public/catalog")
export class PublicCatalogController {
  constructor(private readonly publicCatalogService: PublicCatalogService) {}

  @Get("categories")
  getCategories() {
    return this.publicCatalogService.getCategories();
  }

  @Get("products")
  getProducts(@Query() query: PublicCatalogPageQueryDto) {
    return this.publicCatalogService.getProducts(query.page);
  }

  @Get("categories/:slug/products")
  getCategoryProducts(
    @Param() params: PublicCategorySlugParamsDto,
    @Query() query: PublicCatalogPageQueryDto,
  ) {
    return this.publicCatalogService.getCategoryProducts(params.slug, query.page);
  }
}

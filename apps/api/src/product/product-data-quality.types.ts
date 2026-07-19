export interface ProductDataQualityMissingRule {
  code: string;
  isCritical: boolean;
  name: string;
}

export interface ProductDataQualityResult {
  completionPercentage: number;
  isPublicationReady: boolean;
  missingRequiredFields: ProductDataQualityMissingRule[];
}

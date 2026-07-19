export interface ProductConfigurationValidationResult {
  isValid: boolean;
  unavailableAddonServiceIds: string[];
  unavailableGiftBoxId?: string;
}

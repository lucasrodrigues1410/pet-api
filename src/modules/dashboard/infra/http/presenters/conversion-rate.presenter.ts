import { ConversionRate } from "@/modules/dashboard/domain/value-objects/conversion-rate";

export class ConversionRatePresenter {
	static present(conversionRate: ConversionRate) {
		return {
			rate: conversionRate.rate,
			changePercentage: conversionRate.changePercentage,
		};
	}
}

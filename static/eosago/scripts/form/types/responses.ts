export interface BrandEntity {
	id: number,
	name: string,
	nameRu: string,
}

export interface GetBrandsResponse {
	data: {
		brands: Array<BrandEntity>
	}
}

export interface ModelEntity {
	id: number,
	name: string,
	nameRu: string,
}

export interface GetModelsResponse {
	data: {
		models: Array<ModelEntity>
	}
}

export interface GetAutoIdResponse {
	result: {
		status: 'success' | 'Failed',
		errors: {
			code: string,
			message: string,
		}[]
	},
	data?: {
		inquiryId: string
	}
}

export interface GetAutoDataResponse {
	result: {
		status: 'Failed' | 'Processing' | 'Ready',
		errors: {
			code: string,
			message: string,
		}[]
	},
	data: {
		diagnosticCard?: {
			number: string,
			dateTo: string
		},
		regData?: {
			regNumber?: string,
			sts?: string,
			pts?: string,
			vin?: string,
			body?: string
		},
		updateTime?: string,
		vehicle?: {
			brand?: {
				brandName?: string,
				brandNameDict?: string,
				id?: number,
				model?: {
					id?: number,
					modelNameDict?: string,
					modelName?: string,
					[key: string]: any
				}
			},
			vehicleSpecs?: {
				enginePowerHp: number,
				enginePowerKw: number,
				issueYear: number,
				brandName?: string,
				modelName?: string,
				[key: string]: number | string | undefined
			}
		}
	},
	error?: string
}

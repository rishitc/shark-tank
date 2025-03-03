export namespace main {
	
	export class Message {
	    Message: string;
	    Name: string;
	    IsShark: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Message(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Message = source["Message"];
	        this.Name = source["Name"];
	        this.IsShark = source["IsShark"];
	    }
	}
	export class RawFormData {
	    CompanyName: string;
	    FounderName: string;
	    ImpactStatement: string;
	    Problem: string;
	    ProductDescription: string;
	    Revenue: string;
	    FundingRaised: string;
	    Valuation: string;
	    OfferAmount: string;
	    OfferPercentage: string;
	    InvestmentPurpose: string;
	    Industry: string;
	
	    static createFrom(source: any = {}) {
	        return new RawFormData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.CompanyName = source["CompanyName"];
	        this.FounderName = source["FounderName"];
	        this.ImpactStatement = source["ImpactStatement"];
	        this.Problem = source["Problem"];
	        this.ProductDescription = source["ProductDescription"];
	        this.Revenue = source["Revenue"];
	        this.FundingRaised = source["FundingRaised"];
	        this.Valuation = source["Valuation"];
	        this.OfferAmount = source["OfferAmount"];
	        this.OfferPercentage = source["OfferPercentage"];
	        this.InvestmentPurpose = source["InvestmentPurpose"];
	        this.Industry = source["Industry"];
	    }
	}

}


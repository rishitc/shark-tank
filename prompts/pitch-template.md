# {{ .CompanyName }} - {{ .Industry }}

## The Entrepreneur

Hi Sharks, my name is **{{ .FounderName }}**, and I'm the founder of **{{ .CompanyName }}**.

## The Impact

{{ .ImpactStatement }}

## The Problem

Let's spend a moment on the problem we're solving.

{{ .Problem }}

## The Solution

Our solution is with the following product:

{{ .ProductDescription }}

## Business Traction

Let's talk a bit more about the financial side of my business.

- **Revenue (Last 12 Months)**: {{ formatMoney .Revenue }}
- **Total Funding Raised**: {{ formatMoney .FundingRaised }}
- **Current Valuation**: {{ formatMoney .Valuation }}

## The Deal

I'm asking for **{{ formatMoney .OfferAmount }}** in exchange for **{{ .OfferPercentage }}%** equity in **{{ .CompanyName }}**.

## Investment Purpose

The reason I'm asking for this investment is because I need to do the following:
{{ .InvestmentPurpose }}

## Why Invest?

{{ .CompanyName }} is positioned to disrupt the {{ .Industry }} industry. With your investment and expertise, we can accelerate our growth and make an even bigger impact.

Thank you for your consideration. I'm happy to answer any questions you may have.

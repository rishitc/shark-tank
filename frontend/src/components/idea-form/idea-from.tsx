import React, { useState } from "react";
import "./idea-form.css";
import template from "../../assets/images/shark-tank.png";
import { ProcessIdeaForm } from "../../../wailsjs/go/main/App";
import { main } from "../../../wailsjs/go/models";
import { useNavigate } from "react-router";
const IdeaForm: React.FC = () => {
  const initialState: main.RawFormData = {
    CompanyName: "",
    FounderName: "",
    ImpactStatement: "",
    Problem: "",
    ProductDescription: "",
    Revenue: "",
    FundingRaised: "",
    Valuation: "",
    OfferAmount: "",
    OfferPercentage: "",
    InvestmentPurpose: "",
    Industry: "",
  };

  const [formData, setFormData] = useState<main.RawFormData>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsLoading(true);
    // Add your submission logic here
    ProcessIdeaForm(formData).then(() => {
      navigate("/chat");
    });
  };

  const handleReset = () => {
    setFormData(initialState);
  };

  return (
    <div className="idea-form-container open-sans-400">
      <div className="idea-form-header">
        <img
          src={template}
          alt="Shark Tank Logo"
          width="90%"
          onClick={() => {
            let el = document.getElementById("idea-form-title");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
            el = document.getElementById("companyName");
            if (el && el instanceof HTMLInputElement) {
              el.select();
            }
          }}
        />
        <h1 className="idea-form-title">
          Got what it takes to grab your dream deal?
        </h1>
        <h2 className="idea-form-subtitle">Click the logo to begin...</h2>
      </div>
      <h1 id="idea-form-title" className="idea-form-title">
        Your Idea
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="CompanyName"
            value={formData.CompanyName}
            onChange={handleChange}
            placeholder="Enter your company name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="founderName">Founder Name</label>
          <input
            type="text"
            id="founderName"
            name="FounderName"
            value={formData.FounderName}
            onChange={handleChange}
            placeholder="Enter founder's name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="impactStatement">Impact Statement</label>
          <input
            type="text"
            id="impactStatement"
            name="ImpactStatement"
            value={formData.ImpactStatement}
            onChange={handleChange}
            placeholder="A short statement describing the impact of your company"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="problem">Problem Statement</label>
          <small className="form-hint">
            Please provide real-world examples to better illustrate the problem.
          </small>
          <textarea
            id="problem"
            name="Problem"
            value={formData.Problem}
            onChange={handleChange}
            placeholder="Describe the problem your company addresses"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="productDescription">Product Description</label>
          <textarea
            id="productDescription"
            name="ProductDescription"
            value={formData.ProductDescription}
            onChange={handleChange}
            placeholder="Describe your product or service in detail"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="revenue">Revenue in the past 12 months ($)</label>
          <input
            type="number"
            id="revenue"
            name="Revenue"
            value={formData.Revenue}
            onChange={handleChange}
            placeholder="0"
            min="0"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fundingRaised">Funding Raised ($)</label>
          <input
            type="number"
            id="fundingRaised"
            name="FundingRaised"
            value={formData.FundingRaised}
            onChange={handleChange}
            placeholder="0"
            min="0"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="valuation">Valuation ($)</label>
          <input
            type="number"
            id="valuation"
            name="Valuation"
            value={formData.Valuation}
            onChange={handleChange}
            placeholder="0"
            min="0"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group offer-group">
          <label>Offer for the Sharks</label>
          <div className="offer-inputs">
            <div className="offer-input">
              <label htmlFor="offerAmount">Amount ($)</label>
              <input
                type="number"
                id="offerAmount"
                name="OfferAmount"
                value={formData.OfferAmount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                disabled={isLoading}
              />
            </div>
            <div className="offer-input">
              <label htmlFor="offerPercentage">Equity (%)</label>
              <input
                type="number"
                id="offerPercentage"
                name="OfferPercentage"
                value={formData.OfferPercentage}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="100"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="investmentPurpose">
            Purpose for raising investment in Shark Tank
          </label>
          <textarea
            id="investmentPurpose"
            name="InvestmentPurpose"
            value={formData.InvestmentPurpose}
            onChange={handleChange}
            placeholder="Explain how you plan to use the investment"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="industry">Industry</label>
          <input
            type="text"
            id="industry"
            name="Industry"
            value={formData.Industry}
            onChange={handleChange}
            placeholder="E.g. Technology, Healthcare, Finance, etc."
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-buttons">
          <button
            type="button"
            onClick={handleReset}
            className="reset-button"
            disabled={isLoading}
          >
            Reset
          </button>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdeaForm;

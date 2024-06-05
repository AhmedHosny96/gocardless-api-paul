const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

class GoCardlessService {
  constructor() {
    this.baseUrl = process.env.BASE_URL;
    this.secretId = process.env.SECRET_ID;
    this.secretKey = process.env.SECRET_KEY;
  }

  async getToken() {
    const url = `${this.baseUrl}/token/new/`;

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const requestBody = {
      secret_id: this.secretId,
      secret_key: this.secretKey,
    };

    try {
      const response = await axios.post(url, requestBody, { headers });
      return response.data.access;
    } catch (error) {
      console.error("Request failed with status code:", error.response?.status);
      return error.message;
    }
  }

  async getBanks(country) {
    const url = `${this.baseUrl}/institutions/?country=${country}`;

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${await this.getToken()}`,
    };

    try {
      const response = await axios.get(url, { headers });
      return {
        status: 200,
        message: "Success",
        bankList: response.data,
      };
    } catch (error) {
      console.error("Error fetching banks:", error.response?.data);
      return {
        status: error.response?.status || 500,
        message: "An error occurred while fetching institutions.",
        bankList: [],
      };
    }
  }

  async requestAccess(bankId) {
    const url = `${this.baseUrl}/requisitions/`;

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${await this.getToken()}`,
    };

    const requestBody = {
      institution_id: bankId,
      redirect: "https://wedoaccounting.co.uk/",
    };

    try {
      const response = await axios.post(url, requestBody, { headers });
      return {
        status: "200",
        message: "Success",
        ...response.data,
      };
    } catch (error) {
      console.error("Error requesting access:", error.response?.data);
      return {
        status: error.response?.status || "500",
        message: "An internal error occurred.",
      };
    }
  }
}

module.exports = GoCardlessService;

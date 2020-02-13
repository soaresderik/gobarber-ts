import axios from "axios";

export default class BaseHttpService {
  private BASE_URL: string =
    process.env.NODE_ENV === "production"
      ? process.env.API_URL
      : "https://app2.mercadocf.site";
  private accessToken: string | null = null;

  async get(endpoint: string, options = {}) {
    Object.assign(options, this.getCommonOptions());
    return axios
      .get(`${this.BASE_URL}/${endpoint}`, options)
      .catch(error => this.handleHttpError(error));
  }

  async post(endpoint: string, data = {}, options = {}) {
    Object.assign(options, this.getCommonOptions());
    return axios
      .post(`${this.BASE_URL}/${endpoint}`, data, options)
      .catch(error => this.handleHttpError(error));
  }

  async delete(endpoint: string, options = {}) {
    Object.assign(options, this.getCommonOptions());
    return axios
      .delete(`${this.BASE_URL}/${endpoint}`, options)
      .catch(error => this.handleHttpError(error));
  }

  async patch(endpoint: string, data = {}, options = {}) {
    Object.assign(options, this.getCommonOptions());
    return axios
      .patch(`${this.BASE_URL}/${endpoint}`, data, options)
      .catch(error => this.handleHttpError(error));
  }

  async put(endpoint: string, data = {}, options = {}) {
    Object.assign(options, this.getCommonOptions());
    return axios
      .put(`${this.BASE_URL}/${endpoint}`, data, options)
      .catch(error => this.handleHttpError(error));
  }

  public getAccessToken = () => {
    return this.accessToken || this.loadToken();
  };

  public loadToken = () => {
    const token = localStorage.getItem("accessToken");
    this.accessToken = token;
    return token;
  };

  public saveToken = (accessToken: string) => {
    this.accessToken = accessToken;
    return localStorage.setItem("accessToken", accessToken);
  };

  public removeToken = () => {
    localStorage.removeItem("accessToken");
  };

  private handleHttpError = (error: any) => {
    const { statusCode } = error?.response.data;

    if (statusCode !== 401) throw error;

    this.removeToken();
    throw error;
  };

  private getCommonOptions = () => {
    const token = this.loadToken();

    return {
      headers: {
        Authorization: `${token}`
      }
    };
  };
}

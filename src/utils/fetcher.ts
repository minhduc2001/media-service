import axios, { AxiosRequestConfig } from "axios";
import { envConfig } from "../configs/env.config";

class Fetcher {
  private getConfig() {
    return {
      baseUrl: envConfig.BASE_URL_MAIN_SERVER,
      headers: {
        ContentType: "application/json",
        Accept: "application/json",
      },
    };
  }

  public async GET<T>(
    url: string,
    configs: AxiosRequestConfig = { ...this.getConfig }
  ): Promise<T> {
    return (await axios.get(url, configs)).data;
  }

  public async POST<T>(
    url: string,
    body: any,
    configs: AxiosRequestConfig = { ...this.getConfig }
  ): Promise<T> {
    return (await axios.post(url, body, configs)).data;
  }

  public async PUT<T>(
    url: string,
    body: any,
    configs: AxiosRequestConfig = { ...this.getConfig }
  ): Promise<T> {
    return (await axios.put(url, body, configs)).data;
  }

  public async PATCH<T>(
    url: string,
    body: any,
    configs: AxiosRequestConfig = { ...this.getConfig }
  ): Promise<T> {
    return (await axios.patch(url, body, configs)).data;
  }

  public async DELETE<T>(
    url: string,
    configs: AxiosRequestConfig = { ...this.getConfig }
  ): Promise<T> {
    return (await axios.delete(url, configs)).data;
  }
}

const fetcher = new Fetcher();
export default fetcher;

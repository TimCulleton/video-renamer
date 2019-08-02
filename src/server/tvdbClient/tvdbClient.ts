import https from "https";

export interface ITvDbClientConfig {
    authToken?: string;
    apiKey: string;
    requester(config: IRequesterConfig): Promise<string>;
}

export interface IRequesterConfig {
    authToken?: string;
    data: string;
    endpoint: string;
}

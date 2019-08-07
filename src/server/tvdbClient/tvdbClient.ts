import https from "https";
import http from "http";
import { ROOT_END_POINT } from "./tvdbTypes";
import { EndPoint } from "./tvdbTypes";
import * as tvdbTypes from "./tvdbTypes";

export interface ITvDbClientConfig {
    authToken?: string;
    apiKey: string;
    requester?(config: IRequesterConfig): Promise<IRequestData>;
}

export interface IRequesterConfig {
    authToken?: string;
    data?: string;
    endpoint: string;
    method: string;
}

export interface IRequestData {
    response: http.IncomingMessage;
    data: string;
}

export class TvDBClient {

    private _config: ITvDbClientConfig;

    constructor(config: ITvDbClientConfig) {
        this._config = config;
    }

    public async login(apikey: string): Promise<tvdbTypes.ILoginResponse> {
        const requestData: tvdbTypes.ILoginRequest = {
            apikey,
        };

        const responseData = await this._requester({
            data: JSON.stringify(requestData),
            method: "POST",
            endpoint: EndPoint.Login,
        });

        const statusCode = responseData.response.statusCode;
        // OK
        if (statusCode === 200) {
            return JSON.parse(responseData.data);
            // Returned when invalid apikey is supplied
        } else if (statusCode === 401) {
            throw new Error(JSON.parse(responseData.data).Error);
        } else {
            throw responseData;
        }
    }

    public async searchSeries(searchConfig: tvdbTypes.ISearchSeriesRequest, token: string): Promise<tvdbTypes.ISearchSeriesResponse> {

        const params: string = Object.entries(searchConfig).reduce((accumulator, set, index) => {
            const prefix = index === 0 ? "?" : "&";
            accumulator.push(prefix);
            accumulator.push(set[0]);
            accumulator.push("=");
            accumulator.push(set[1]);
            return accumulator;
        }, [] as string[]).join("");

        const responseData = await this._requester({
            method: "GET",
            endpoint: encodeURI(EndPoint.SearchSeries + params),
            authToken: token,
        });

        const statusCode = responseData.response.statusCode;
        if (statusCode === 200) {
            return JSON.parse(responseData.data);
            // Returned when invalid apikey is supplied
        } else if (statusCode === 401) {
            throw new Error(JSON.parse(responseData.data).Error);
        } else {
            throw responseData;
        }
    }

    public async seriesEpisodes(episodesConfig: tvdbTypes.ISeriesEpisodesRequest, token: string): Promise<tvdbTypes.ISearchSeriesResponse> {
        const params = episodesConfig.page
            ? `?page=${episodesConfig.page}`
            : "";
        const path = EndPoint.SeriesEpisodes.replace(/{id}/, episodesConfig.id.toString()) + params;

        const responseData = await this._requester({
            method: "GET",
            endpoint: encodeURI(path),
            authToken: token,
        });

        const statusCode = responseData.response.statusCode;
        if (statusCode === 200) {
            return JSON.parse(responseData.data);
            // Returned when invalid apikey is supplied
        } else if (statusCode === 401) {
            throw new Error(JSON.parse(responseData.data).Error);
        } else {
            throw responseData;
        }
    }

    private async _requester(config: IRequesterConfig): Promise<IRequestData> {
        const reqOptions: https.RequestOptions = {
            hostname: ROOT_END_POINT,
            path: `/${config.endpoint}`,
            method: config.method,
            headers: {
            },
        };

        // Add auth token to requests
        if (config.authToken && reqOptions.headers) {
            reqOptions.headers.authorization = `Bearer ${config.authToken}`;
        }

        // If post data is present set the headers
        if (config.data && reqOptions.headers) {
            reqOptions.headers["content-length"] = config.data.length;
            reqOptions.headers["content-type"] = `application/json`;
        }

        return new Promise<IRequestData>((resolve, reject) => {
            const req = https.request(reqOptions, res => {
                res.setEncoding("utf8");

                const buffer: string[] = [];
                res.on("data", d => {
                    buffer.push(d);
                });

                res.on("error", e => {
                    reject(e);
                });

                res.on("end", () => {
                    resolve({
                        response: res,
                        data: buffer.join(""),
                    });
                });
            });

            if (config.data) {
                req.write(config.data);
            }

            req.end();
        });
    }
}

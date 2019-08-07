import EventEmitter from "events";
import https from "https";
import { TvDBClient } from "../../../src/server/tvdbClient/tvdbClient";
import * as TvDBTypes from "../../../src/server/tvdbClient/tvdbTypes";

describe(`TVDB Client Tests`, () => {

    let authToken: string;
    const useServiceMock = true;
    const API_KEY = `217570E2EAD13858`;

    it(`Login to tvdbAPI valid apiKey`, async () => {
        const tvdbClient = new TvDBClient({
            apiKey: ``,
        });

        if (useServiceMock) {

            const responseData: TvDBTypes.ILoginResponse = {
                token: "random-token",
            };

            const apiKey = `some-fake-key`;

            mockServiceCall({
                statusCode: 200,
                responseData: JSON.stringify(responseData),
                requestWrite: (writeData: string) => {
                    const parsedData: TvDBTypes.ILoginRequest = JSON.parse(writeData);
                    expect(parsedData.apikey).toBe(apiKey);
                },
            });

            const data = await tvdbClient.login(apiKey);
            expect(data).toBeTruthy();
            expect(data.token).toBeTruthy();
            authToken = data.token;

        } else {
            const data = await tvdbClient.login(API_KEY);
            expect(data).toBeTruthy();
            expect(data.token).toBeTruthy();
            authToken = data.token;
        }
    });

    it(`Login to tvdbAPI invalid apiKey`, async done => {
        const tvdbClient = new TvDBClient({
            apiKey: ``,
        });

        if (useServiceMock) {
            const errorData = `{"Error":"API Key Required"}`;

            mockServiceCall({
                statusCode: 401,
                responseData: errorData,
            });

            try {
                await tvdbClient.login(`xxx-xxxx`);
                done.fail(`Should have thrown an invalid error`);
            } catch (e) {
                expect(e).toBeTruthy();
                expect(e.message).toBe("API Key Required");
                done();
            }

        } else {
            try {
                await tvdbClient.login(`xxx-xxxx`);
                done.fail(`Should have thrown an invalid error`);
            } catch (e) {
                expect(e).toBeTruthy();
                done();
            }
        }

    });

    xit(`Search Series One Piece`, async () => {
        const tvdbClient = new TvDBClient({
            apiKey: ``,
        });

        const data = await tvdbClient.searchSeries({
            name: "One Piece",
        },
            authToken);

        expect(data).toBeTruthy();
    });

    xit(`Get Episodes for show`, async () => {
        const tvdbClient = new TvDBClient({
            apiKey: ``,
        });

        const data = await tvdbClient.seriesEpisodes({
            id: 81797,
        }, authToken);

        expect(data).toBeTruthy();
    });
});

interface IMockServiceCallConfig {
    statusCode: number;
    responseData: string;
    checkOptions?: (options: https.RequestOptions) => void;
    requestWrite?: (data: any) => void;
}

interface IMockServiceData {
    spy: jasmine.Spy;
    requestResponse: MockServiceResponse;
}

function mockServiceCall(config: IMockServiceCallConfig): IMockServiceData {
    const response = new MockServiceResponse();
    const mockRequest = spyOn(https, "request")
        .and.callFake((options: https.RequestOptions, callback: (e: MockServiceResponse) => void) => {

            if (config.checkOptions) {
                config.checkOptions(options);
            }

            const request = {
                write: (data: any) => {
                    if (config.requestWrite) {
                        config.requestWrite(data);
                    }
                },

                end: () => {
                    // fire data event with mock response
                    response.emit("data", config.responseData);
                    // Finish the request
                    response.emit("end");
                },
            };

            response.statusCode = config.statusCode;
            callback(response);

            return request;
        });

    return {
        spy: mockRequest,
        requestResponse: response,
    };
}

class MockServiceResponse extends EventEmitter {
    public statusCode: number;

    constructor() {
        super();
        this.statusCode = 0;
    }

    public setEncoding(encoding: string) {
        return undefined;
    }
}

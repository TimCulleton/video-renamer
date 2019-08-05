import { TvDBClient } from "../../../src/server/tvdbClient/tvdbClient";

describe(`TVDB Client Tests`, () => {

    let authToken: string;
    it(`Login to tvdbAPI valid apiKey`, async () => {
        const tvdbClient = new TvDBClient({
            apiKey: ``,
        });

        const data = await tvdbClient.login(`217570E2EAD13858`);
        expect(data).toBeTruthy();
        expect(data.token).toBeTruthy();
        authToken = data.token;
    });

    it(`Login to tvdbAPI invalid apiKey`, async done => {
        const tvdbClient = new TvDBClient({
            apiKey: ``,
        });

        try {
            const data = await tvdbClient.login(`xxx-xxxx`);
            done.fail(`Should have thrown an invalid error`);
        } catch (e) {
            expect(e).toBeTruthy();
            done();
        }
    });

    it(`Search Series One Piece`, async () => {
        const tvdbClient = new TvDBClient({
            apiKey: ``,
        });

        const data = await tvdbClient.searchSeries({
            name: "One Piece",
        },
        authToken);

        expect(data).toBeTruthy();
    });

    it(`Get Episodes for show`, async () => {
        const tvdbClient = new TvDBClient({
            apiKey: ``,
        });

        const data = await tvdbClient.seriesEpisodes({
            id: 81797,
        }, authToken);

        expect(data).toBeTruthy();
    });
});

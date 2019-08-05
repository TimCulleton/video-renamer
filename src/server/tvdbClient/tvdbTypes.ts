
export const ROOT_END_POINT = `api.thetvdb.com`;

export enum EndPoint {
    Login = "login",
    SearchSeries = "search/series",
    Series = "series",
    SeriesEpisodes = "series/{id}/episodes",
}

export interface ILoginRequest {
    apikey: string;
    username?: string;
    userkey?: string;
}

export interface ILoginResponse {
    token: string;
}

export interface ISearchSeriesRequest {
    name?: string;
    imdbId?: string;
    zap2itId?: string;
    slug?: string;
}

export interface ISearchSeriesResponse {
    data: ISearchSeriesData[];
}

export interface ISearchSeriesData {
    aliases: string[];
    banner: string;
    firstAired: string;
    id: number;
    network: string;
    overview: string;
    seriesName: string;
    slug: string;
    status: string;
}

export interface ISeriesEpisodesRequest {
    id: number;
    page?: number;
}

export interface ISeriesEpisodesResponseData {
    links: IPaginatedData;
    data: IEpisodeData[];
}

export interface IPaginatedData {
    first: number;
    last: number;
    next: number;
    prev: number;
}

export interface IEpisodeData {
    id: number;
    airedSeason: number;
    airedSeasonID: number;
    airedEpisodeNumber: number;
    episodeName: string;
    firstAired: string;
    guestStars: string[];
    director: string;
    directors: string[];
    writers: string[];
    overview: string;
    language: IEpisodeLanguage;
    productionCode: string;
    showUrl: string;
    lastUpdated: number;
    dvdDiscid: string;
    dvdSeason: number;
    dvdEpisodeNumber: number;
    dvdChapter: null;
    absoluteNumber: number;
    filename: string;
    seriesId: number;
    lastUpdatedBy: number;
    airsAfterSeason: string;
    airsBeforeSeason: string;
    airsBeforeEpisode: string;
    thumbAuthor: number;
    thumbAdded: string;
    thumbWidth: string;
    thumbHeight: string;
    imdbId: string;
    siteRating: string;
    siteRatingCount: number;
}

export interface IEpisodeLanguage {
    episodeName: string;
    overview: string;
}

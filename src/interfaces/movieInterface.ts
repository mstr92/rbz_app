export interface Movie {
    id: number;
    imdb_id: string;
    title: string;
    image?: string;
    year?: number;
    actors?: string;
    alignment?: string;
    favourite?: boolean;
    rating?: number;
    vote?:number;
}
export interface Actor {
    id: number;
    firstname: string;
    lastname: string;
    alignment?: string;
}
export interface Year {
    from: number;
    to: number;
    alignment: string;
}
export interface Genre {
    id: number;
    name: string;
    alignment: string;
}
export interface Keyword {
    name: string;
    alignment: string;
}
export interface PartialMovieSearchRequest {
    movies?: Array<Movie>;
    actors?: Array<Actor>;
    timeperiod?: Array<Year>;
    keywords?: Array<Keyword>;
    genres?: Array<Genre>;
}
export interface CompleteMovieSearchRequest {
    entity: string;
    data: PartialMovieSearchRequest;
    length: number;
}

export interface MovieResult {
    id?: number,
    result: Array<Movie>
}
export interface Poster {
    imdb_id: string;
    poster: string;
}
export interface MovieHistory {
    timestamp: string;
    request: CompleteMovieSearchRequest;
    result: MovieResult;
}

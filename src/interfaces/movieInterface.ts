export interface Movie {
    id: number;
    imdb_id: number;
    title: string;
    image: string;
    year?: number;
    alignment?: string;
    favourite?: boolean;
    rating?: number;
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
    result: Array<Movie>
}

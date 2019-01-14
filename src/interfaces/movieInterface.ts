export interface Movie {
    id: number;
    imdb_id: string;
    title: string;
    image?: string;
    year?: number;
    actors?: string;
    alignment?: string;
    favourite?: boolean;
    favourite_date?: string;
    rating?: number;
    rating_date?: string;
    vote?:number;
    genre?:Array<string>
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
    id: number,
    timestamp: string;
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
export interface EngineRequest {
    'length'?: Number
    'neg_year_from'?: Array<Number>,
    'pos_year_from'?: Array<Number>,
    'neg_year_to'?: Array<Number>,
    'pos_year_to'?: Array<Number>,
    'neg_movie'?: Array<String>,
    'pos_movie'?: Array<String>,
    'neg_actor'?: Array<String>,
    'pos_actor'?: Array<String>,
    'neg_genre'?: Array<String>,
    'pos_genre'?: Array<String>,
    'neg_keyword'?: Array<String>,
    'pos_keyword'?: Array<String>
}
export interface Test {
    entry: Map<String,Movie>
}

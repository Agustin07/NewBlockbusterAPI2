import { QueryMoviesDto } from '../dto/movie.dto';

export interface Builder {
    setTitle(): void;
    setTags(): void;
    setAvailability(): void;
    setSortedBy():void;
}

export interface SeachQuery {
    title : string, 
    sortedBy: string, 
    availability: boolean,
    tags: string[],
}

/* istanbul ignore file */

export class SearchMovieBuilder implements Builder {
    private params: QueryMoviesDto;
    private query: SeachQuery;
    constructor(params: QueryMoviesDto) {
        this.params = params;
        this.query = {title:'%%',sortedBy:'title',availability:true,tags:[]};
    }


    public setTitle(): void {
      if (this.params.hasOwnProperty('title')) 
        this.query.title= '%'+this.params.title+'%'; 
    }

    public setSortedBy(): void {
      if (this.params.hasOwnProperty('sortedBy')) 
        this.query.sortedBy= this.params.sortedBy; 
    }

    public setAvailability(): void {
      if (this.params.hasOwnProperty('availability')) {
        if (this.params.availability === 'false') 
          this.query.availability = false;
      }
    }

    public setTags(): void {
        if (this.params.hasOwnProperty('tags')) {
            this.query.tags = this.params.tags.replace(' ','').split('|');
        }
            

    }

    public getQuery() {
        return this.query;
    }
    
}

export class BuilderDirector {
    private builder: Builder;

    public setBuilder(builder: Builder): void {
        this.builder = builder;
    }

    public buildTGQuery(): void {
        this.builder.setTitle();
        this.builder.setAvailability();
        this.builder.setTags();
        this.builder.setSortedBy();
    }
}

export const clientSearchQuery = (director: BuilderDirector, params : QueryMoviesDto) => {
    const builder = new SearchMovieBuilder(params);
    director.setBuilder(builder);
    director.buildTGQuery()
    return builder.getQuery();
}
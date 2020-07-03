# My New Blockbuster API

## Modules

**Movies Module :** 
- Handle crud operations for movies (create modify, delete, serach one or all )
- Handle add or delete a tag for one movie. Only admin can do this task.
- Handle the rent and buy one or more movies. 
- Handle the return of a rented movies.
- Search movies using filters.

**Auth Module :** 
- Handle login authentication and the authorization using JWT token. Also Handle roles permission.
- Handle the reset of a password.

**Users Module :** 
- Handle crud operations for users (create modify, delete, serach one or all ).
- Handle changes of roles.
- Handle change password


### Requirements:

| | VERSION |
|----------------|---------------|
|Node| ^12.16.3 |
|Typescript | ^3.7.4 |
|Nestjs | ^7.0.0 |
|@nestjs/config| ^0.5.0|
|psql (PostgreSQL)| ^9.4.4|

## Creating the database
Run the .sql file, it will create the database called: **"blockbusterdb"**

```
\i dbtest_script.sql
```

>*important: an Admin user will be created! test login with it!*
>```
> {
>   "username": "admin@admin.com",
>   "password": "admin"
> }
>```


## Endpoints description

| **Endpoint** | **Description** |**AuthKey**|**Role**|
|--|--|--|--|
| POST `/login` | Authenticate user and retrieve an auth key | No required ||
| POST `/resetPassword` | Send an email with instrutions for password reset | No required ||
| GET `/reset/:keyword` | Verify a valid token for reset the password | No required ||
| POST `/reset/:keyword` | Reset the password | No required ||
| POST `/users` | Create user account | No required ||
| GET `/users` | Get all users registered | Required ||
| GET `/users/:id` | Get user by id | Required ||
| PUT `/users/:id` | Modify user information by id | required | CLIENT|
| DELETE `/users/:id` | Delete user by id | Required |CLIENT|
| POST `/movies` | Save a movie | Required |ADMIN|
|GET `/movies`| Retrieve all the movies availables (sorted alphabetically) |Required||
| GET `/movies/:id` | Get movie by id | No required ||
| PUT `/movies/:id` | Modify movie information by id | Required | ADMIN|
| DELETE `/movies/:id` | Delete movie by id | Required |ADMIN|
| POST `/movies/:id/tag` | Add a Tag to a movie by id | Required | ADMIN|
| DELETE `/movies/:id/tag` | Delete a Tag if exist in movie by id | Required |ADMIN|
| POST `/movies/rent`| Rent one or more movies by an id or a list of ids |Required| CLIENT|
| POST `/movies/buy`| Buy one or more movies by an id or a list of ids|Required|CLIENT|
| POST `/movies/:id/return`| Return a rented movie by id|Required|CLIENT|
| GET `/movies/rented`| Get the array of rented movies |Required| CLIENT|
| GET `/movies/bought`| Get the array of purchased movies|Required|CLIENT|

Try to login using admin account created by default in the dbtest_script.sql! 

Check test examples on our postman official collection!
![My blockbuster collection on Postman!](https://i.ibb.co/K6Vzs5j/blockusterrrr.png)

### Reset your password, mail example!

![My blockbuster collection on Postman!](https://i.ibb.co/bNtV8Wb/Captura.png)


## Search movies using query filters

| **Query** |**Description**| **Values** |**Default**|
|--|--|--|--|
|title|Search for coincidences on title |string||
|availability| Search for available or non-available movies|true / false|true|
|tags|Search for movies filter by a tag name|tagname||
|sortedBy|Order the movies by title (alphabetical) or likes|title / likes| title|

*Example*:
```
localhost:3000/movies?sortedBy=likes&tags:COMEDY|ACTION&title=street
```


## Postman and Swaggers tests and endpoints documentation

**You can check endpoints' tests here:**

-  [My blockbuster webpage examples on Postman](https://documenter.getpostman.com/view/11476851/T17AhqDr?version=latest)

-  [Postman collection link](https://www.getpostman.com/collections/b2b9ba05e766afa98531)

-  [Swagger link](https://app.swaggerhub.com/apis/agusxx/blockbuster-api/1.0.0)


## Test examples

```javascript
`#movies.service.ts`
  takeOne(movie: Movie) {
    if (movie.stock === 0) throw new NotFoundException(`Sorry, movie ${movie.title} sold out.`);
    if (movie.availability === false)
      throw new NotFoundException(`Sorry, movie ${movie.title} not available.`);
    movie.stock--;
    if (movie.stock === 0) movie.availability = false;
    return movie;
  }

  returnOne(movie: Movie) {
    movie.stock++;
    if (movie.availability === false) movie.availability = true;
    return movie;
  }

`#mocks/movies.mocks.ts`

	export  const  movie1 : Movie = {
		id:  1,
		title:  "Finding Nemo",
		description:  "Marlyn is a fish and is looking for Nemo",
		poster:  "https://i.ibb.co/k8Dkx86/descarga-2.jpg",
		stock:  5,
		trailer:"https://www.youtube.com/watch?v=9oQ628Seb9w",
		price:  5.99,
		availability:  true,
	};

  
	export  const  movie2 : Movie = {
		id:  2,
		title:  "Finding Dory",
		description:  "Now Marlyn and Nemo are looking for Dory",
		poster:  "https://i.ibb.co/Kyp82Br/descarga-3.jpg",
		stock:  1,
		trailer:"https://www.youtube.com/watch?v=JhvrQeY3doI",
		price:  6.99,
		availability:  true,
	};

 
	export  const  movie3 : Movie = {
		id:  3,
		title:  "21 Jump Street",
		description:  "The best police officers of their home",
		poster:  "https://i.ibb.co/Nst027S/descarga.jpg",
		stock:  2,
		trailer:"https://www.youtube.com/watch?v=RLoKtb4c4W0",
		price:  5.99,
		availability:  false,
	};

	export const movie4: Movie = {
		id: 4,
		title: '22 Jump Street',
		description: 'On university, the best polices',
		poster: 'https://i.ibb.co/Nst027S/descarga.jpg',
		stock: 0,
		trailer: 'https://www.youtube.com/watch?v=RLoKtb4c4W0',
		price: 6.99,
		availability: false,
	};


	describe('takeOne', () => {
		it('takeOne should be defined', () => {
		expect(service.takeOne).toBeDefined();
		});
		it('should returns movie1 with {stock:4, availability: true}', async () => {
		//inputs
		const movie = movie1;
		//mocks implementations
		//outputs
		const expected = {stock:4, availability: true};
		//excecute
		const res = service.takeOne(movie);
		//validation
		expect(res.stock).toEqual(expected.stock);
		expect(res.availability).toEqual(expected.availability);
		});
		it('should returns movie1 with {stock:0, availability: false}', async () => {
		//inputs
		const movie = movie2;
		//mocks implementations
		//outputs
		const expected = {stock:0, availability: false};
		//excecute
		const res = service.takeOne(movie);
		//validation
		expect(res.stock).toEqual(expected.stock);
		expect(res.availability).toEqual(expected.availability);
		});
		it('should throw NotFoundException because movie3 { availability= false}', async () => {
		//inputs
		const movie = movie3;
		//mocks implementations
		//outputs
		const expected = NotFoundException;
		//excecute
		try {
			const res = service.takeOne(movie);
		}
		catch (e) {
			//validation
			expect(e).toBeInstanceOf(expected);
			expect(e).toEqual(Error(`Sorry, movie ${movie.title} not available.`))
		}
		});
		it('should throw NotFoundException because movie4 {sotck = 0}', async () => {
		//inputs
		const movie = movie4;
		//mocks implementations
		//outputs
		const expected = NotFoundException;
		//excecute
		try {
			const res = service.takeOne(movie);
		}
		catch (e) {
			//validation
			expect(e).toBeInstanceOf(expected);
			expect(e).toEqual(Error(`Sorry, movie ${movie.title} sold out.`))
		}
		});
	});
		
`#movies.service.spec.ts`

```






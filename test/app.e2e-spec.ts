import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import UsersService from '../src/users/users.service';
import { user1 } from '../src/users/mocks/users.mocks';

describe('Blockbuster API (e2e)', () => {
  let app: INestApplication;
  let userService = { 
    findOneByEmail: jest.fn(), 
    getUsers:jest.fn()};


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/login (POST)',()=>{
    it('admin login', async () => {
      return await request(app.getHttpServer())
        .post('/login')
        .send({username:'admin@admin.com',password:'admin'})
        .expect(201);
    });
    it('no valid password, throw 401', async () => {
      return await request(app.getHttpServer())
        .post('/login')
        .send({username:'admin@admin.com',password:'wrongpassword'})
        .expect(401);
    });
    it('no valid email, throw 401', async () => {
      return await request(app.getHttpServer())
        .post('/login')
        .send({username:'junior@admin.com',password:'admin'})
        .expect(401);
    });

  });
  
  

  it('/users (GET)', () => {
    const expected=[
        { id: 1, email: 'admin@admin.com', username: 'admin' },
        { id: 2, email: 'rigoomartinez@gmail.com', username: 'agusxx' }
    ];
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNTkzMjE0MTY1LCJleHAiOjE1OTU4MDYxNjV9.Xd0bPfrnyVGfSYBb_4woE0RRl4LfetAcKqIHmnikdq8`)
      .expect(200)
      .expect(expected);
  });
  //   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IkNMSUVOVCIsImlhdCI6MTU5MzIxNDIzOCwiZXhwIjoxNTk1ODA2MjM4fQ.PU9Yv5sSESTu5vcYFOgta2Nwij1zsPF5DtIQfu6Jvec

  
  

  afterAll(async () => {
    await app.close();
  });
});

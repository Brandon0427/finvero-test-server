import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum';
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { CreateAccountDto, EditAccountDto } from "../src/account/dto";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  jest.setTimeout(10000);

  beforeAll(async() => {
    //Dependencies imports
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    //Nest.js test server initialization
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    );

    //Initialize and listen to the port
    await app.init();
    await app.listen(5005);

    //Clean de DB
    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    //Base Testing URL
    pactum.request.setBaseUrl('http://localhost:5005')
  })

  afterAll(() => {
    //After all tests are done, shut down the app.
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'brandon@grupoldm.com.mx',
      password: 'TestingPassword',
      firstName: 'User',
      lastName: 'Test'
    }

    //Sign Up Route Testing
    describe('Sign Up', () => {
      //Empty Email Error
      it('Should throw ERROR for empty email', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });

      //Empty Password Error
      it('Should throw ERROR for empty password', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });

      //Empty Email and Password Error
      it('Should throw ERROR for empty email and password', () => {
        return pactum.spec()
          .post('/auth/signup')
          .expectStatus(400);
      });

      //Invalid email input Error
      it('Should throw ERROR for invalid email input', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            email: 'test',
            password: 'ThisIsJustATest'
          })
          .expectStatus(400);
      });

      //Successful Sign Up
      it('Should Sign Up', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      //Should not be able to create a duplicate user
      it('Should throw ERROR for duplicate user creation', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });

    //Sing In Route Testing
    describe('Sign In', () => {
      //Empty Email Error
      it('Should throw ERROR for empty email', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });

      //Empty Password Error
      it('Should throw ERROR for empty password', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });

      //Empty Email and Password Error
      it('Should throw ERROR for empty email and password', () => {
        return pactum.spec()
          .post('/auth/signin')
          .expectStatus(400);
      });

      //Invalid email input Error
      it('Should throw ERROR for invalid email input', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            email: 'test',
            password: 'ThisIsJustATest'
          })
          .expectStatus(400);
      });

      //Empty Email and Password Error
      it('Should throw ERROR for non-existing user', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            email: 'test@gmail.com',
            password: 'ThisIsJustATest'
          })
          .expectStatus(403);
      });

      //Successful Sign In
      it('Should Sign In', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAT', 'accessToken'); //1: Name of the variable, 2: Path of the value
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it('Should get current user', () => {
        return pactum.spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}'
          })
          .expectStatus(200);
      })
    });
    describe('Edit User', () => {
      it('Should edit current user', () => {
        const dto: EditUserDto = {
          firstName: 'Brandon',
          lastName: 'Najera'
        }
        return pactum.spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName);
      })
    });
  });

  describe('Accounts', () => {
    //No account yet created
    describe('Get All Accounts', () => {
      it('Should get empty array of accounts', () => {
        return pactum.spec()
          .get('/accounts')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}'
          })
          .expectStatus(200)
          .expectBody([]);
      })
    });
  });
});
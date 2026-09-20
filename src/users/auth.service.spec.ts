import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //*  Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('first@test.com', '123');

    expect(user.password).not.toEqual('123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user sign up with email that is in use', async () => {
    await service.signup('first@test.com', '123');

    await expect(service.signup('first@test.com', '123')).rejects.toThrow();
  });

  it('throws if signin is called with and unused email', async () => {
    await expect(service.signin('aaa@aa.com', '123')).rejects.toThrow();
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('saasa@asas.com', 'correct');

    await expect(
      service.signin('saasa@asas.com', 'correcta'),
    ).rejects.toThrow();
  });
  it('returns a user if correct password os provided', async () => {
    await service.signup('asdff@asdf.com', 'mypassword');

    const user = await service.signin('asdff@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});

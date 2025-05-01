import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';
import { UserType } from '../../generated/prisma/client';


describe('RegisterDto', () => {
  it('should be defined', () => {
    const dto = new RegisterDto();
    // @ts-ignore - bypassing readonly for testing
    dto.userType = UserType.INDIVIDUAL;
    expect(dto).toBeDefined();
  });

  it('should equals', () => {
    const dto: RegisterDto = {
      username: 'hantsy',
      password: 'password',
      firstName: 'Hantsy',
      lastName: 'Bai',
      email: 'hantsy@gmail.com',
      userType: UserType.INDIVIDUAL,
    };

    expect(dto).toEqual({
      username: 'hantsy',
      password: 'password',
      firstName: 'Hantsy',
      lastName: 'Bai',
      email: 'hantsy@gmail.com',
      userType: UserType.INDIVIDUAL,
    });
  });

  it('should validate and pass', async () => {
    const dto: RegisterDto = {
      username: 'user',
      password: 'password123',
      firstName: 'first',
      lastName: 'last',
      email: 'user@example.com',
      userType: UserType.INDIVIDUAL,
    };

    const errors = await validate(dto);
    expect(errors.length).toEqual(0);
  });
});

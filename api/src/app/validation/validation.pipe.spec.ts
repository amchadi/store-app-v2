import { ValidationPipe } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';

class TestDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;
}

describe('Global ValidationPipe', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  it('should accept a valid DTO', async () => {
    const result = await pipe.transform(
      {
        name: 'Adnane',
        email: 'adnane@example.com',
      },
      {
        type: 'body',
        metatype: TestDto,
      },
    );

    expect(result).toEqual({
      name: 'Adnane',
      email: 'adnane@example.com',
    });
  });

  it('should reject an invalid DTO', async () => {
    await expect(
      pipe.transform(
        {
          name: 'A',
          email: 'invalid-email',
        },
        {
          type: 'body',
          metatype: TestDto,
        },
      ),
    ).rejects.toThrow();
  });

  it('should reject unknown properties', async () => {
    await expect(
      pipe.transform(
        {
          name: 'Adnane',
          email: 'adnane@example.com',
          unknown: 'not-allowed',
        },
        {
          type: 'body',
          metatype: TestDto,
        },
      ),
    ).rejects.toThrow();
  });
});

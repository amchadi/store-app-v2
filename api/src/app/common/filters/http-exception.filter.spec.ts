import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  const createHost = () => {
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();

    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status,
          json,
        }),
        getRequest: () => ({
          url: '/api/test',
        }),
      }),
    } as unknown as ArgumentsHost;

    return { host, status, json };
  };

  it('should handle HttpException', () => {
    const { host, status, json } = createHost();

    filter.catch(new BadRequestException('Invalid request'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        path: '/api/test',
        timestamp: expect.any(String),
      }),
    );
  });

  it('should handle unknown exceptions as 500', () => {
    const { host, status, json } = createHost();

    filter.catch(new Error('Database crashed'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal server error',
        path: '/api/test',
        timestamp: expect.any(String),
      }),
    );
  });
});

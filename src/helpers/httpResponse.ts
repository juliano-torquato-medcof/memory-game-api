export interface IHttpResponse<T = any> {
  statusCode: number;
  body: T;
  url?: string;
  headers?: Record<string, string>;
  isRaw?: boolean;
  errorInfo?: Error;
  noLog?: boolean;
}

export class ApplicationError<T = any> implements IHttpResponse<T> {
  body!: T;
  url?: string;
  headers?: Record<string, string>;
  isRaw?: boolean;
  errorInfo?: Error;
  noLog?: boolean;
  statusCode!: number;
}

export const badRequest = (error: string | object): IHttpResponse => {
  const applicationError = new ApplicationError();
  applicationError.statusCode = 400;
  applicationError.body = { error };
  return applicationError;
};

export const unauthorized = (error: string | object): IHttpResponse => {
  const applicationError = new ApplicationError();
  applicationError.statusCode = 401;
  applicationError.body = { error };
  return applicationError;
};

export const forbidden = (error: string | object): IHttpResponse => {
  const applicationError = new ApplicationError();
  applicationError.statusCode = 403;
  applicationError.body = { error };
  return applicationError;
};

export const pageNotFound = (error?: string | object): IHttpResponse => {
  const applicationError = new ApplicationError();
  applicationError.statusCode = 404;
  applicationError.body = { error };
  return applicationError;
};

export const unprocessable = (data: any): IHttpResponse => ({
  statusCode: 422,
  body: data,
});

export const serverError = (error: string | object, err?: Error): IHttpResponse => {
  const applicationError = new ApplicationError();
  applicationError.statusCode = 500;
  applicationError.body = { error };
  applicationError.errorInfo = err;
  return applicationError;
};

export const conflict = (error: string | object): IHttpResponse => {
  const applicationError = new ApplicationError();
  applicationError.statusCode = 409;
  applicationError.body = { error };
  return applicationError;
};

export const noContent = (): IHttpResponse => ({
  statusCode: 204,
  body: null,
});

export const ok = (data: any, options?: { noLog?: boolean }): IHttpResponse => ({
  statusCode: 200,
  body: data,
  noLog: options?.noLog,
});

export const redirect = (data: { url: string; statusCode: number; headers?: Record<string, string> }): IHttpResponse => ({
  url: data.url,
  statusCode: data.statusCode,
  body: null,
  headers: data.headers,
});

export const notModified = (data: any): IHttpResponse => ({
  statusCode: 304,
  body: data,
});

export const csv = (data: any): IHttpResponse => ({
  statusCode: 200,
  body: data,
  headers: {
    'Content-Type': 'text/csv',
  },
  isRaw: true,
});

export const pdf = (data: any, pdfName: string): IHttpResponse => ({
  statusCode: 200,
  body: data,
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment;filename=\"${pdfName}\"`,
  },
  isRaw: true,
});

export const created = (data: any): IHttpResponse => ({
  statusCode: 201,
  body: data,
});

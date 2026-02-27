export class DiscourseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiscourseError";
  }
}

export class ApiError extends DiscourseError {
  public readonly errors: string[];
  public readonly errorType?: string;
  public readonly status: number;

  constructor(status: number, errors: string[], errorType?: string) {
    super(`API error (${status}): ${errors.join(", ")}`);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.errorType = errorType;
  }
}

export class RequestError extends DiscourseError {
  constructor(message: string) {
    super(`HTTP request failed: ${message}`);
    this.name = "RequestError";
  }
}

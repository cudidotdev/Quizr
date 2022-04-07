class ApiError extends Error {
  name: string;
  message: string;
  status: number;
  constructor(name: string, message: string, status?: number) {
    super(message);
    this.name = name;
    this.message = message;
    this.status = status ?? 500;
  }
}

export default ApiError;

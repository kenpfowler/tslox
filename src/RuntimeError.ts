import Token from './Token';

/**
 * Defines a runtime error in the program.
 */
class RuntimeError extends Error {
  readonly token: Token;

  constructor(token: Token, message: string) {
    super(message);
    this.token = token;
  }
}

export default RuntimeError;

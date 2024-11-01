import { LoxLiteral } from './Token.ts';

export default class ReturnValue extends Error {
  public readonly value: LoxLiteral;

  constructor(value: LoxLiteral) {
    super();
    this.value = value;
  }
}

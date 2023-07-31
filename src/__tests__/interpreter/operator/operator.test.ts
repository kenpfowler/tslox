import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('operators', () => {
    const folder = 'operator';
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('adds numbers and strings', () => {
      matchPrintOutput(folder, 'add.lox', ['579', 'string']);
    });

    test('evaluates comparisons', () => {
      matchPrintOutput(folder, 'comparison.lox', [
        'true',
        'false',
        'false',
        'true',
        'true',
        'false',
        'false',
        'false',
        'true',
        'false',
        'true',
        'true',
        'false',
        'false',
        'false',
        'false',
        'true',
        'true',
        'true',
        'true',
      ]);
    });

    test('divides numbers', () => {
      matchPrintOutput(folder, 'divide.lox', ['4', '1']);
    });

    test('evaluates equality', () => {
      matchPrintOutput(folder, 'equals.lox', [
        'true',
        'true',
        'false',
        'true',
        'false',
        'true',
        'false',
        'false',
        'false',
        'false',
      ]);
    });

    test('multiplies numbers', () => {
      matchPrintOutput(folder, 'multiply.lox', ['15', '3.702']);
    });

    test('negates numbers', () => {
      matchPrintOutput(folder, 'negate.lox', ['-3', '3', '-3']);
    });

    test('evaluates not equal', () => {
      matchPrintOutput(folder, 'not_equal.lox', [
        'false',
        'false',
        'true',
        'false',
        'true',
        'false',
        'true',
        'true',
        'true',
        'true',
      ]);
    });

    test('subtracts numbers', () => {
      matchPrintOutput(folder, 'subtract.lox', ['1', '0']);
    });
  });
});

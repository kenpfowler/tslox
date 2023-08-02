import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('and/or', () => {
    const folder = 'logical_operator';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('executes logical and expression', () => {
      matchPrintOutput(folder, 'and.lox', ['false', '1', 'false', 'true', '3', 'true', 'false']);
    });

    test('executes a logical or expression', () => {
      matchPrintOutput(folder, 'or.lox', ['1', '1', 'true', 'false', 'false', 'false', 'true']);
    });

    test('evaluates conditions as expected', () => {
      matchPrintOutput(folder, 'and_truth.lox', ['false', 'nil', 'ok', 'ok', 'ok']);
    });

    test('executes statement with dangling else correctly', () => {
      matchPrintOutput(folder, 'or_truth.lox', ['ok', 'ok', 'true', '0', 's']);
    });
  });
});

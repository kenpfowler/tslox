import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('numbers', () => {
    const folder = 'number';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('evaluates numbers correctly', () => {
      matchPrintOutput(folder, 'literal.lox', ['123', '987654', '0', '123.456', '-0.001']);
    });

    test('evaluates nan equality correctly', () => {
      matchPrintOutput(folder, 'nan_equality.lox', ['false', 'true', 'false', 'true']);
    });
  });
});

import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('operators', () => {
    const folder = 'operator';
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('adds numbers and strings correctly', () => {
      matchPrintOutput(folder, 'add.lox', ['579', 'string']);
    });

    test('evaluates comparisons correctly', () => {
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

    test('divides numbers correctly', () => {
      matchPrintOutput(folder, 'divide.lox', ['4', '1']);
    });
  });
});

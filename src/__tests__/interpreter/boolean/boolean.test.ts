import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('booleans', () => {
    const folder = 'boolean';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('evaluates equalities', () => {
      matchPrintOutput(folder, 'equality.lox', [
        'true',
        'false',
        'false',
        'true',
        'false',
        'false',
        'false',
        'false',
        'false',
        'false',
        'true',
        'true',
        'false',
        'true',
        'true',
        'true',
        'true',
        'true',
      ]);
    });

    test('evaluates the not operator', () => {
      matchPrintOutput(folder, 'not.lox', ['false', 'true', 'true']);
    });
  });
});

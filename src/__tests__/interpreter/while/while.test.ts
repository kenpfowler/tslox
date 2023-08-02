import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('while loops', () => {
    const folder = 'while';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('can be expressed in required syntax', () => {
      matchPrintOutput(folder, 'syntax.lox', ['1', '2', '3', '0', '1', '2']);
    });
  });
});

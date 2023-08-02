import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('for', () => {
    const folder = 'for';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('variables can be assigned in the global scope', () => {
      matchPrintOutput(folder, 'scope.lox', ['0', '-1', 'after', '0']);
    });
  });
});

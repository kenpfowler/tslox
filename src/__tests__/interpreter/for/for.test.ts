import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('for loops', () => {
    const folder = 'for';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('can work with variables from all required scopes', () => {
      matchPrintOutput(folder, 'scope.lox', ['0', '-1', 'after', '0']);
    });
  });
});

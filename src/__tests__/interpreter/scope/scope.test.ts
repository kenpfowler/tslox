import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('scope', () => {
    const folder = 'scope';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('respects variable scope', () => {
      matchPrintOutput(folder, 'scope.lox', ['inner', 'outer']);
    });
  });
});

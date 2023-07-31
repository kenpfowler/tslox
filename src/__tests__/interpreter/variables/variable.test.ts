import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('variables', () => {
    const folder = 'variables';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('prints nil for uninitialized variable', () => {
      matchPrintOutput(folder, 'uninitialized.lox', ['nil']);
    });
  });
});

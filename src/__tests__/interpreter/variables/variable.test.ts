import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('variables', () => {
    const folder = 'variables';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('correctly prints strings', () => {
      matchPrintOutput(folder, 'uninitialized.lox', ['nil']);
    });
  });
});

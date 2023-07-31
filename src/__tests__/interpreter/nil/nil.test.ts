import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('nil', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('correctly prints nil value', () => {
      matchPrintOutput('nil', 'literal.lox', ['nil']);
    });
  });
});

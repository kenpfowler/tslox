import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('strings', () => {
    const folder = 'string';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('prints strings', () => {
      matchPrintOutput(folder, 'literal.lox', ['()', 'a string', 'A~¶Þॐஃ']);
    });

    test('prints multiline strings', () => {
      matchPrintOutput(folder, 'multiline.lox', ['1\n2\n3']);
    });
  });
});

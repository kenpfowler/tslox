import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('if/else', () => {
    const folder = 'if';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('executes an if statement', () => {
      matchPrintOutput(folder, 'if.lox', ['good', 'block', 'true']);
    });

    test('executes an else statement', () => {
      matchPrintOutput(folder, 'else.lox', ['good', 'good', 'block']);
    });

    test('evaluates conditions as expected', () => {
      matchPrintOutput(folder, 'truth.lox', [
        'false',
        'nil',
        'true',
        '0',
        'empty',
      ]);
    });

    test('executes statement with dangling else correctly', () => {
      matchPrintOutput(folder, 'dangling_else.lox', ['good']);
    });
  });
});

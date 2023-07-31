import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('comments', () => {
    const folder = 'comments';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('prints with a comment at end of file', () => {
      matchPrintOutput(folder, 'line_at_eof.lox', ['ok']);
    });

    test('has no output when there is a comment and empty line', () => {
      matchPrintOutput(folder, 'only_line_comment_and_line.lox', []);
    });

    test('has no output when there is only a comment in the file', () => {
      matchPrintOutput(folder, 'only_line_comment.lox', []);
    });

    test('ignores unicode characters in comments', () => {
      matchPrintOutput(folder, 'unicode.lox', ['ok']);
    });

    test('ignores multi line comments', () => {
      matchPrintOutput(folder, 'unicode.lox', ['ok']);
    });
  });
});

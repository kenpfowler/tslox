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

    test('can return inside loop', () => {
      matchPrintOutput(folder, 'return_inside.lox', ['i']);
    });

    test('can return in closure', () => {
      matchPrintOutput(folder, 'return_closure.lox', ['i']);
    });

    test('can assign properly when closure in body', () => {
      matchPrintOutput(folder, 'closure_in_body.lox', ['1', '2', '3']);
    });
  });
});

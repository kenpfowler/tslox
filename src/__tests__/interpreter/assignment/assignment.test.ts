import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('assignment', () => {
    const folder = 'assignment';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('variables can be assigned in the global scope', () => {
      matchPrintOutput(folder, 'global.lox', ['before', 'after', 'arg', 'arg']);
    });

    test('variable assignment should be right associative', () => {
      matchPrintOutput(folder, 'associativity.lox', ['c', 'c', 'c']);
    });

    // Assignment on RHS of variable.
    test('assignment should happen on right hand side of variable', () => {
      matchPrintOutput(folder, 'syntax.lox', ['var', 'var']);
    });
  });
});

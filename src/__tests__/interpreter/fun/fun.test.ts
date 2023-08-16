import { matchPrintOutput } from '../../../tool/test.util';

describe('Interpreter Class', () => {
  describe('functions', () => {
    const folder = 'fun';

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('prints nil when function with empty body is called', () => {
      matchPrintOutput(folder, 'empty_body.lox', ['nil']);
    });

    test('should be able to handle recursion in local scope', () => {
      matchPrintOutput(folder, 'local_recursion.lox', ['21']);
    });

    test('should be able to handle nested calls with args', () => {
      matchPrintOutput(folder, 'nested_call_with_args.lox', ['hello world']);
    });

    test('can be declared with one or more parameters', () => {
      matchPrintOutput(folder, 'parameters.lox', [
        '0',
        '1',
        '3',
        '6',
        '10',
        '15',
        '21',
        '28',
        '36',
      ]);
    });

    test('name of function is printed correctly', () => {
      matchPrintOutput(folder, 'print.lox', ['<fn foo>', '<native fn>']);
    });

    test('should be able to handle recursion', () => {
      matchPrintOutput(folder, 'recursion.lox', ['21']);
    });
  });
});

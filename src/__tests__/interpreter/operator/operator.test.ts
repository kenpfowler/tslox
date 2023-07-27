import Lox from '../../../Lox';
import path from 'path';
import fs from 'fs';

function runTest(folder: string, test: string, results: string[]) {
  const fullPath = path.resolve(process.cwd(), `./__tests__/interpreter/${folder}/${test}`);
  const data = fs.readFileSync(fullPath, 'utf8');
  const consoleSpy = jest.spyOn(console, 'log');
  Lox.run(data);

  for (let index = 1; index < results.length + 1; index++) {
    expect(consoleSpy).toHaveBeenNthCalledWith(index, results[index - 1]);
  }
}

describe('Interpreter Class', () => {
  describe('operators', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('adds numbers and strings correctly', () => {
      runTest('operator', 'add.lox', ['579', 'string']);
    });

    test('evaluates comparisons correctly', () => {
      runTest('operator', 'comparison.lox', [
        'true',
        'false',
        'false',
        'true',
        'true',
        'false',
        'false',
        'false',
        'true',
        'false',
        'true',
        'true',
        'false',
        'false',
        'false',
        'false',
        'true',
        'true',
        'true',
        'true',
      ]);
    });

    test('divides numbers correctly', () => {
      runTest('operator', 'divide.lox', ['4', '1']);
    });
  });
});

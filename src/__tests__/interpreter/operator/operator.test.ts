import Lox from '../../../Lox';
import path from 'path';
import fs from 'fs';
import RuntimeError from '../../../RuntimeError';

function initTest(folder: string, test: string) {
  const fullPath = path.resolve(process.cwd(), `./__tests__/interpreter/${folder}/${test}`);
  const data = fs.readFileSync(fullPath, 'utf8');
  const expression = Lox.run(data);
  return expression;
}

describe('Interpreter Class', () => {
  describe('operators', () => {
    test('adds 1 + 2 + 3 correctly', () => {
      const output = initTest('operator', 'add.lox');
      expect(output).toBe('6');
    });

    test("concatenates 'Hello, ' + 'World!' correctly", () => {
      const output = initTest('operator', 'concat.lox');
      expect(output).toBe('Hello, World!');
    });

    test('divides 8 / 2 correctly', () => {
      const output = initTest('operator', 'divide.lox');
      expect(output).toBe('4');
    });

    test('divides 12.34 / 12.34 correctly', () => {
      const output = initTest('operator', 'divide_2.lox');
      expect(output).toBe('1');
    });

    test('evaluates 1 == 1 correctly', () => {
      const output = initTest('operator', 'equality.lox');
      expect(output).toBe('true');
    });
  });
});

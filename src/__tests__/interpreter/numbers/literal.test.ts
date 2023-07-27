// TODO: this should be a functional test of the output of our interpreter where input = file.lox and output will be what it interprets

import path from 'path';
import fs from 'fs';
import Lox from '../../../Lox';

test('Returns the number 123', () => {
  const fullPath = path.resolve(process.cwd(), './__tests__/interpreter/numbers/literal.lox');
  const data = fs.readFileSync(fullPath, 'utf8');
  const expression = Lox.run(data);

  if (expression) expect(expression).toBe('123');
});

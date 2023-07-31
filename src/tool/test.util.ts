import path from 'path';
import fs from 'fs';
import Lox from '../Lox';

export function matchPrintOutput(folder: string, test: string, results: string[]) {
  const fullPath = path.resolve(process.cwd(), `./__tests__/interpreter/${folder}/${test}`);
  const data = fs.readFileSync(fullPath, 'utf8');
  const consoleSpy = jest.spyOn(console, 'log');
  Lox.run(data);

  for (let index = 1; index < results.length + 1; index++) {
    expect(consoleSpy).toHaveBeenNthCalledWith(index, results[index - 1]);
  }
}

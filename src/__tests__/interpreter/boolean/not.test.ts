import { assertSpyCall, assertSpyCalls, spy } from '@std/testing/mock';
import * as path from 'jsr:@std/path';
import Lox from '../../../Lox.ts';

Deno.test('evaluates the not operator', () => {
  const consoleSpy = spy(console, 'log');

  const data = Deno.readTextFileSync(
    path.join(Deno.cwd(), '/src/__tests__/interpreter/boolean/not.lox'),
  );

  Lox.run(data);

  const results = ['false', 'true', 'true'];

  assertSpyCalls(consoleSpy, results.length);

  for (let index = 0; index < results.length; index++) {
    assertSpyCall(consoleSpy, index, { args: [results[index]] });
  }
});

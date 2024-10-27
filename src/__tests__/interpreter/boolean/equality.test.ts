import { assertSpyCall, assertSpyCalls, spy } from '@std/testing/mock';
import * as path from 'jsr:@std/path';
import Lox from '../../../Lox.ts';

Deno.test('evaluates equalities', () => {
  const consoleSpy = spy(console, 'log');

  const data = Deno.readTextFileSync(
    path.join(Deno.cwd(), '/src/__tests__/interpreter/boolean/equality.lox'),
  );

  Lox.run(data);

  const results = [
    'true',
    'false',
    'false',
    'true',
    'false',
    'false',
    'false',
    'false',
    'false',
    'false',
    'true',
    'true',
    'false',
    'true',
    'true',
    'true',
    'true',
    'true',
  ];

  assertSpyCalls(consoleSpy, results.length);

  for (let index = 0; index < results.length; index++) {
    assertSpyCall(consoleSpy, index, { args: [results[index]] });
  }
});

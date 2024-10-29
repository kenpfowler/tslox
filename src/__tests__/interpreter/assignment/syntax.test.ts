import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import * as path from "jsr:@std/path";
import Lox from "../../../Lox.ts";

Deno.test("assignment should happen on right hand side of variable", () => {
  const consoleSpy = spy(console, "log");

  const data = Deno.readTextFileSync(
    path.join(Deno.cwd(), "/src/__tests__/interpreter/assignment/syntax.lox")
  );

  Lox.run(data);

  const results = ["var", "var"];

  assertSpyCalls(consoleSpy, results.length);

  for (let index = 0; index < results.length; index++) {
    assertSpyCall(consoleSpy, index, { args: [results[index]] });
  }
});

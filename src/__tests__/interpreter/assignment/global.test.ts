import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import * as path from "jsr:@std/path";
import Lox from "../../../Lox.ts";

Deno.test("variables can be assigned in the global scope", () => {
  const consoleSpy = spy(console, "log");

  const data = Deno.readTextFileSync(
    path.join(Deno.cwd(), "/src/__tests__/interpreter/assignment/global.lox")
  );

  Lox.run(data);

  const results = ["before", "after", "arg", "arg"];

  assertSpyCalls(consoleSpy, results.length);

  for (let index = 0; index < results.length; index++) {
    assertSpyCall(consoleSpy, index, { args: [results[index]] });
  }
});

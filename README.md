# Lox interpreter

This project is an attempt to adapt the interpreter described in
[Robert Nystrom's Crafting Interpreters](https://craftinginterpreters.com/) from
Java to TypeScript.

# Technologies

- Deno runtime

# Getting Started

## Use interpreter in REPL

run the interpreter from the command line with the following command:

```sh
deno run interpret
```

Then provide the prompt with valid lox code like this:

```
var greeting = "Hello, World!"; print greeting;
```

## Use interpreter with file

create a file in your root directory with a .lox extension

```
touch hello-world.lox
```

point the interpreter to your lox file like this:

```sh
deno run interpret hello-world.lox
```

## Run the test suite

```sh
deno run test
```

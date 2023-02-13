enum TokenType {
  // single character tokens
  LEFT_PAREN = '(',
  RIGHT_PAREN = ')',
  LEFT_BRACE = '{',
  RIGHT_BRACE = '}',
  COMMA = ',',
  DOT = '.',
  PLUS = '+',
  MINUS = '-',
  SEMICOLON = ';',
  SLASH = '/',
  STAR = '*',

  // one or two character tokens
  BANG = '!',
  BANG_EQAUL = '!=',
  EQUAL = '=',
  EQUAL_EQUAL = '==',
  GREATER = '>',
  GREATER_EQUAL = '>=',
  LESS = '<',
  LESS_EQUAL = '<=',

  // literals
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  NUMBER = 'NUMBER',

  // keywords
  AND = 'AND',
  CLASS = 'CLASS',
  ELSE = 'ELSE',
  FALSE = 'FALSE',
  FUN = 'FUN',
  FOR = 'FOR',
  IF = 'IF',
  NIL = 'NIL',
  OR = 'OR',
  PRINT = 'PRINT',
  RETURN = 'RETURN',
  SUPER = 'SUPER',
  THIS = 'THIS',
  TRUE = 'TRUE',
  VAR = 'VAR',
  WHILE = 'WHILE',

  //
  EOF = 'EOF',
}

export default TokenType;

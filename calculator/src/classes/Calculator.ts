/*
Calculator App
Language  : TypeScript
Author    : ghostzero911
License   : GNU 3.0
*/

class Calculator {
  maxDigit: number;

  // Define operator precedence and associativity
  precedence: { [key: string]: number } = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  constructor(digit: number) {
    this.maxDigit = digit;   // Customize the digit limit
  }

  // Helper function to check if a token is a number
  isNumber(token: string): boolean {
    // Handles integers and floating numbers, including scientific notation
    return !isNaN(parseFloat(token)) && isFinite(Number(token));
  }

  // Helper function to check if a token is an operator
  isOperator(token: string): boolean {
    return token in this.precedence;
  }

  // --- Shunting-Yard Algorithm Implementation ---
  infixToPostfix(tokens: string[]): string[] | null {
    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    for (const token of tokens) {
      if (this.isNumber(token)) {
        outputQueue.push(token);
      } else if (this.isOperator(token)) {
        // While there's an operator on the stack with greater or equal precedence
        // (assuming left-associativity for all operators here)
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          this.precedence[operatorStack[operatorStack.length - 1]] >= this.precedence[token]
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        // Pop operators onto the output queue until a '(' is found
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop()!);
        }
        // If the stack runs out without finding '(', parentheses are mismatched
        if (operatorStack.length === 0 || operatorStack[operatorStack.length - 1] !== '(') {
          console.error("Mismatched parentheses detected.");
          return null; // Indicate error
        }
        operatorStack.pop(); // Discard the '('
      } else {
        console.error(`Invalid token encountered: ${token}`);
        return null; // Invalid token
      }
    }

    // Pop any remaining operators from the stack to the output queue
    while (operatorStack.length > 0) {
      const op = operatorStack.pop()!;
      if (op === '(') {
        console.error("Mismatched parentheses detected (extra opening parenthesis).");
        return null; // Mismatched parentheses
      }
      outputQueue.push(op);
    }
    return outputQueue;
  }

  // --- RPN (Postfix) Evaluation ---
  evaluatePostfix(postfixTokens: string[]): number | string {
    const valueStack: number[] = [];

    for (const token of postfixTokens) {
      if (this.isNumber(token)) {
        valueStack.push(parseFloat(token));
      } else if (this.isOperator(token)) {
        if (valueStack.length < 2) {
          return "Error: Invalid expression (not enough operands for operator)";
        }
        const operand2 = valueStack.pop()!;
        const operand1 = valueStack.pop()!;
        let result: number;

        switch (token) {
          case '+':
            result = operand1 + operand2;
            break;
          case '-':
            result = operand1 - operand2;
            break;
          case '*':
            result = operand1 * operand2;
            break;
          case '/':
            if (operand2 === 0) {
              return "Error: Division by zero";
            }
            result = operand1 / operand2;
            break;
          default:
            return `Error: Unknown operator ${token}`; // Should not happen if infixToPostfix is correct
        }
        valueStack.push(result);
      } else {
        return `Error: Invalid token in postfix expression: ${token}`; // Should not happen
      }
    }

    if (valueStack.length !== 1) {
      return "Error: Invalid expression (operands left on stack)";
    }

    return valueStack[0];
  }

  // --- Tokenizer ---
  // Basic tokenizer: splits by spaces and operators/parentheses
  // Handles negative numbers at the start or after an operator/parenthesis
  tokenize(expression: string): string[] | null {
    const tokens: string[] = [];

    // --- Input sanitizer ---
    // This step only needed if the expression is manually inputted.
    // Clean the expression first
    expression = expression.replace(/\s+/g, ''); // Remove all whitespace

    // Simple check for potentially invalid consecutive operators or misplaced operators
    if (/([+\-*/]){2,}|^[*/]|[+\-*/]$/.test(expression)) {
      console.error("Error: Invalid sequence of operators or placement.");
      return null;
    }
    // Check for invalid characters (anything not a digit, dot, operator, or parenthesis)
    if (/[^0-9.\-+*/()]/.test(expression)) {
      console.error("Error: Invalid characters in expression.");
      return null;
    }
    // --- End of Sanitizer ---

    let lastTokenWasOperatorOrParen = true; // Assume start allows negative
    let currentPos = 0;

    while (currentPos < expression.length) {
      let tokenFound = false;

      const numMatch = expression.substring(currentPos).match(/^-?(\d+\.?\d*|\.\d+)/);
      // Try matching number (including potential leading minus)
      // Regex: ^-?(\d+\.?\d*|\.\d+) -> Optional minus, then number pattern
      // Regular expression explanation:
      // ^-?                     -> Start with negative sign (if there is one)
      // (?:\d+\.?\d*|\.\d+)     -> Match numbers (integer, float like 1.23, float like .45)
      // |                       -> OR
      // [+\-*/()]               -> Match operators or parentheses
      // The 'g' flag makes it global (find all matches)

      // Allow '-' only if it's the start or follows an operator/paren '('
      if (numMatch && (!numMatch[0].startsWith('-') || (lastTokenWasOperatorOrParen || currentPos === 0))
      ) {
        const numberToken = numMatch[0];
        tokens.push(numberToken);
        currentPos += numberToken.length;
        lastTokenWasOperatorOrParen = false;
        tokenFound = true;
      } else {
        // Try matching operator or parenthesis
        const opOrParen = expression[currentPos];
        if (/[+\-*/()]/.test(opOrParen)) {
          tokens.push(opOrParen);
          currentPos++;
          // Track if the token allows a subsequent negative number sign
          lastTokenWasOperatorOrParen = (opOrParen !== ')' && /[+\-*/(]/.test(opOrParen));
          tokenFound = true;
        }
      }

      if (!tokenFound) {
        console.error(`Tokenizer error: Cannot process character at index ${currentPos}: "${expression.substring(currentPos)}"`);
        return null; // Indicate tokenization error
      }
    }

    // Final check: ensure last token isn't an operator (unless it's a full expression like '5')
    if (tokens.length > 1 && this.isOperator(tokens[tokens.length - 1])) {
      // Allow expression ending in closing parenthesis
      if (tokens[tokens.length - 1] !== ')') {
        console.error("Expression cannot end with an operator.");
        return null;
      }
    }

    if (tokens.length === 0 && expression.length > 0) {
      console.error("Failed to tokenize non-empty expression.");
      return null;
    }

    if (tokens.some(t => t === undefined || t === null)) return null; // Check for bad tokens

    console.log("Tokens:", tokens); // For debugging
    return tokens;
  }


  // --- Main Calculation Logic ---
  calculateExpression(expression: string): number | string {

    // 1. Tokenize
    const tokens = this.tokenize(expression);
    if (!tokens) {
      console.error("Error: Tokenization failed");
      return "Error: Invalid input or characters.";
    }
    if (tokens.length === 0) {
      console.error("Error: Empty expression");
      return "Please enter an expression.";
    }

    // 2. Convert to Postfix (Shunting-Yard)
    const postfix = this.infixToPostfix(tokens);
    if (!postfix) {
      console.error("Postfix (RPN) Error: Shunting-Yard conversion failed");
      return "Error: Invalid expression format (e.g., mismatched parentheses).";
    }

    // 3. Evaluate Postfix
    const result = this.evaluatePostfix(postfix);
    if (typeof result === 'string' && result.startsWith('Error:')) {
      console.error(result);
    } else {
      console.log(`Calculation result: ${result}`);
    }
    return result;
  }
}

export default Calculator
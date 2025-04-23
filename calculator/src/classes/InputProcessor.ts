/*
InputProcessor.ts
Middleware handler to manage, convert, and sanitize user input from React element into valid Mathematical expression.
Language  : TypeScript
Author    : ghostzero911 / mc888team@gmail.com
License   : GNU 3.0
*/

import Calculator from './Calculator'

export interface State {
  expression: string,
  notation: string,
  history: string[],
  isDirty: boolean,
}

class InputProcessor extends Calculator {
  constructor(digit: number) {
    super(digit);
  }

  // Helper function to count the digit of number input by user
  countDigit(token: string): number {
    token = token.replace(/^-/, ''); // Remove negative notation, if there's one
    return /[.]/.test(token) ? token.length - 1 : token.length; // Subtract the count by 1 on floating numbers
  }

  // Helper function to sanitize the floating number behaviour in JavaScript
  sanitizeDigit(n: number): number {
    const base: number = Math.pow(10, this.maxDigit - 1);
    return Math.round(n * base) / base;
  }

  insertNumber(state: State, key: string): Partial<State> {
    let currExpr = (state.isDirty) ? '' : state.expression;
    let currNot = (state.isDirty) ? '0' : state.notation;
    
    const    // Handling possible condition
      isZero: boolean = /^[0]$/.test(currNot),  // Fresh with no digit
      isNumber: boolean = this.isNumber(currNot),  // Is a valid number
      incompleteNegativeFloat: boolean = /\.([0-9]+)?\)$/.test(currExpr), // Incomplete negative float expressionr ex: -(4.)
      digitCount: number = (isNumber) ? this.countDigit(currNot) : 0;  // Count the current number's digit

    if (digitCount < this.maxDigit) {      
      currExpr = (currExpr && isZero) ? currExpr.replace(/[0]$/, key) 
        : (incompleteNegativeFloat) ? currExpr.replace(/\)$/, key + ')')
        : currExpr + key;
      currNot = (!isNumber || isZero) ? key : currNot + key;
    }
    
    return { expression: currExpr, notation: currNot, isDirty: false }
  }

  insertOperand(state: State, key: string): Partial<State> {
    let currExpr = (state.isDirty) ? state.history[state.history.length - 1] : state.expression;

    const   // Handling possible condition
      isNumber: boolean = this.isNumber(state.notation),
      incompleteFloat: boolean = /[.]$/.test(state.notation);  // Incomplete float ended with decimal sign

    if (isNumber) {
      currExpr = (incompleteFloat)
        ? currExpr.replace(/[.]$/, key) // Replace decimal sign with operator for incomplete float number
        : (currExpr || '0') + key;  // Place operator to the end
    }

    return (isNumber)
      ? { expression: currExpr, notation: key, history: [...state.history, state.notation], isDirty: false }
      : { expression: currExpr.replace(/[+/*-]$/, key), notation: key, isDirty: false }
  }

  insertModifier(state: State, id: string, key: string): Partial<State> {

    let currExpr = (state.isDirty) ? '' : state.expression;
    let currNot = (state.isDirty) ? '0' : state.notation;

    const   // Handling possible condition
      isZero: boolean = (state.isDirty) || /^[0]$/.test(currNot),
      isNumber: boolean = (state.isDirty) || this.isNumber(currNot),
      hasDecimal: boolean = (state.isDirty) || /[.]/.test(currNot),
      hasNegative: boolean = (state.isDirty) || /^[-]/.test(currNot);

    if (id === 'decimal' && !hasDecimal) {  // Allow decimal to be used when no other decimal found
      currExpr = ((isNumber && currExpr ) ? currExpr : currExpr + '0') + key;
      currNot = ((isNumber) ? currNot : '0') + key;   // Add leading 0 if it is a new notation
    }

    if (id === 'negative' && isNumber) {  // Allow negative to be used only on number
      //TODO press negative after result
      // Convert only the number that is located in the last part of expression
      // Use regex to check for parentheses to switch back and forth when the negative sign is pressed
      const regex: RegExp = (hasNegative) ? new RegExp(`\\(${currNot}\\)$`) : new RegExp(currNot + "$");
      const inverse: string = (hasNegative) ? currNot.replace('-','') : (isZero) ? currNot : `-${currNot}`;     
      const inverseExpr: string = (hasNegative) 
        ? currExpr.replace(regex, inverse) : (isZero)
        ? currExpr : currExpr.replace(regex, `(${inverse})`);

      currExpr = (currExpr) ? inverseExpr : currExpr;
      currNot = (currExpr && !isZero) ? inverse : currNot;
    }

    return { expression: currExpr, notation: currNot, isDirty: false }
  }

  getResult(state: State, key: string): Partial<State> {
    let currExpr = (state.isDirty) ? state.history[state.history.length - 1] : state.expression;
    const currNot = state.notation;

    const
      validExpression: string = (!currExpr)  // Handling invalid expressions
        ? '0' : (/[+/*-.]$/.test(currNot))   // Incomplete expression, ended with operator
        ? currExpr.replace(/[+/*-.]$/, '') : currExpr,

      tempResult: string | number = this.calculateExpression(validExpression),

      // We are expecting number from result, so if it returns a string, it means we catch an error
      finalResult: string = (typeof tempResult === 'string') ? 'ERROR'
        : (this.countDigit(this.sanitizeDigit(tempResult).toString()) > this.maxDigit)
          ? tempResult.toExponential(2) : tempResult.toString();  // Convert to string, and adjust decimal place.
        
    // Place '=' sign and the result on complete expressions
    currExpr = (/[+/*-]/.test(currExpr)) ? validExpression + key + finalResult : validExpression;

    return { expression: currExpr, notation: finalResult, history: [...state.history, currNot, finalResult], isDirty: true }
  }
}

export default InputProcessor
type CalculateInput = string;
type CalculateResult = number;

export interface Calculator {
  calculate: (input: CalculateInput) => CalculateResult;
}

interface CalculatorDependencies {
  keyMap: Record<string, string>
}

type Operation = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE' | 'CLEAR' | 'EVALUATE';

type CalculateType = (number | Operation);

type KeyMap = Record<string, Operation>;

const keyMap: KeyMap = {
  '+': 'ADD',
  '-': 'SUBTRACT',
  '*': 'MULTIPLY',
  '/': 'DIVIDE',
  'c': 'CLEAR',
  '=': 'EVALUATE'
}

const sanitize = (input: string, keyMap: KeyMap): CalculateType[] | undefined => {
  const calculateType: CalculateType[] = [];

  let numberArray: string[] = [];
  for(const char of input) {
    if(keyMap[char]) {
      if (numberArray.length > 0) {
        calculateType.push(parseInt(numberArray.join("")))
        numberArray = [];
      }

      calculateType.push(keyMap[char])
      continue;
    }

    if (!parseInt(char)) {
      return undefined;
    }

    numberArray.push(char);
  }

  if (numberArray.length > 0) {
    calculateType.push(parseInt(numberArray.join("")));
  }

  return calculateType;
}

function performMultiply(evaluateTarget: CalculateType[]) {
  const evaluateMultiplation: CalculateType[] = [...evaluateTarget];

  // first, perform multiply and divide operations;
  let i = 0;
  while (i < evaluateMultiplation.length) {
    if (evaluateTarget[i] === 'MULTIPLY') {
      const leftOperand = evaluateMultiplation[i - 1];
      const rightOperand = evaluateMultiplation[i + 1];
      if (typeof leftOperand !== 'number' || typeof rightOperand !== 'number') {
        throw new Error("Multiply targets are not numbers");
      }
      const newValue = leftOperand * rightOperand;
      evaluateMultiplation.splice(i-1, i+ 2, newValue);
      continue;
    }

    if (evaluateTarget[i] === 'DIVIDE') {
      const leftOperand = evaluateMultiplation[i - 1];
      const rightOperand = evaluateMultiplation[i + 1];
      if (typeof leftOperand !== 'number' || typeof rightOperand !== 'number') {
        throw new Error("Multiply targets are not numbers");
      }
      const newValue = leftOperand / rightOperand;
      evaluateMultiplation.splice(i-1, i+2, newValue);
      continue;
    }

    i += 1;
  }
  return evaluateMultiplation;
}

function performAddSubtract(evaluateTarget: CalculateType[]) {
  const evaluateMultiplation: CalculateType[] = [...evaluateTarget];
  // first, perform multiply and divide operations;
  let i = 0;
  while (i < evaluateMultiplation.length) {
    if (evaluateMultiplation[i] === 'ADD') {
      const leftOperand = evaluateMultiplation[i - 1];
      const rightOperand = evaluateMultiplation[i + 1];
      if (typeof leftOperand !== 'number' || typeof rightOperand !== 'number') {
        throw new Error("Multiply targets are not numbers");
      }
      const newValue = leftOperand + rightOperand;
      evaluateMultiplation.splice(i-1, i + 2, newValue);
      continue;
    }

    if (evaluateMultiplation[i] === 'SUBTRACT') {
      const leftOperand = evaluateMultiplation[i - 1];
      const rightOperand = evaluateMultiplation[i + 1];
      if (typeof leftOperand !== 'number' || typeof rightOperand !== 'number') {
        throw new Error("Multiply targets are not numbers");
      }
      const newValue = leftOperand - rightOperand;
      evaluateMultiplation.splice(i-1, i+2, newValue);
      continue;
    }

    i += 1;
  }
  return evaluateMultiplation;
}

const handleCalculation = (sanitizedInput: CalculateType[]) => {
  // copy list for work to do;
  const tempList = [...sanitizedInput]

  if (tempList[tempList.length - 1] === 'CLEAR') {
    return [];
  }

  const maybeEvaluateIndex = tempList.findIndex(type => {
    return type === 'EVALUATE';
  });

  if (maybeEvaluateIndex !== -1) {
    // Evaluate everything up to this index
    const evaluateTarget = tempList.slice(0, maybeEvaluateIndex);
    const evaluateMultiple = performMultiply(evaluateTarget);
    const evaluateAddition = performAddSubtract(evaluateMultiple);

    return [
      ...evaluateAddition,
      ...tempList.slice(maybeEvaluateIndex + 1, tempList.length)
      ];
  }

  return tempList;
  }

const findLastNumber = (list: CalculateType[]) => {
  const li = [...list];
  return li.reverse().find(type => {
    return typeof type === 'number';
  })
}

export const makeCalculator = (): Calculator => {
  let memory: CalculateType[] = [];

  return {
   calculate: (input: CalculateInput) => {
     const sanitizedInput: CalculateType[] | undefined = sanitize(input, keyMap);
     if (!sanitizedInput) {
       return NaN;
     }

     memory = handleCalculation([
       ...memory,
       ...sanitizedInput
     ]);

     // return the last valid number
     const lastNumber = findLastNumber(memory);

     if (!lastNumber) {
       return 0;
     }

     return lastNumber;
   }
 }
}
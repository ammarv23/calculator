type CalculateInput = string;
type CalculateResult = string;

export interface Calculator {
  calculate: (input: CalculateInput) => CalculateResult;
}

interface CalculatorDependencies {
  keyMap: Record<string, string>
}

export const makeCalculator = (): Calculator => ({
  calculate: (input: CalculateInput) => {
    return input;
    // Sanitize input

    // retain the state and perform the calculation

    // parse the output.
  }
})
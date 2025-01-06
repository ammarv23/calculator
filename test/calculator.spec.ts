import { describe, expect, it } from 'vitest';
import { makeCalculator } from '../src/makeCalculator';

describe("calculator", () => {
  it('should output the last entered number from the provided string', () => {
    const input = '2+45';
    const expected = 45;

    const calculator = makeCalculator()

    expect(calculator.calculate(input)).toEqual(expected);
  })

  it('should correctly evaluate a string at the "=" position and output the result', () => {
    const input = '2+45=';
    const expected = 47;

    const calculator = makeCalculator()

    expect(calculator.calculate(input)).toEqual(expected);
  })

  it('should retain the state of multiple inputs until an evaluation occurs', () => {
    const inputs = [
      {
        calculateInput: '2+',
        calculateResult: 2
      },
      {
        calculateInput: '45',
        calculateResult: 45,
      },
      {
        calculateInput: '=',
        calculateResult: 47
      }
    ];

    const calculator = makeCalculator()

    for (const { calculateInput, calculateResult } of inputs) {
      expect(calculator.calculate(calculateInput)).toEqual(calculateResult);
    }
  });

  it('should clear the calculate output and state when the AC key is supplied', () => {
    const inputs = [
      {
        calculateInput: '2+45',
        calculateResult: 45
      },
      {
        calculateInput: 'c',
        calculateResult: 0
      }
    ]

    const calculator = makeCalculator();

    for (const { calculateInput, calculateResult } of inputs) {
      expect(calculator.calculate(calculateInput)).toEqual(calculateResult);
    }
  });

  it('should return a NaN response when an invalid input is provided', () => {
    const input = {
      calculateInput: 'invalid',
      calculateResult: NaN
    }

    const calculator = makeCalculator();

    expect(calculator.calculate(input.calculateInput)).toEqual(input.calculateResult)
  });

  it('should return a NaN response when dividing by 0', () => {
    const input = {
      calculateInput: '3/0=',
      calculateResult: NaN
    }

    const calculator = makeCalculator();

    expect(calculator.calculate(input.calculateInput)).toEqual(input.calculateResult)
  });

  it('should represent negative numbers', () => {
    const input = {
      calculateInput: '1-3=',
      calculateResult: -2
    }

    const calculator = makeCalculator();

    expect(calculator.calculate(input.calculateInput)).toEqual(input.calculateResult)
  });

  it('should evaluate and continue processing if the last input is not "Evaluate"', () => {
    const inputs = [
      {
        calculateInput: '1+1',
        calculateResult: 1
      },
      {
        calculateInput: '+1=+1',
        calculateResult: 1
      },
      {
        calculateInput: '=',
        calculateResult: 4
      }
    ]

    const calculator = makeCalculator();

    for (const { calculateInput, calculateResult } of inputs) {
      expect(calculator.calculate(calculateInput)).toEqual(calculateResult);
    }
  })
})
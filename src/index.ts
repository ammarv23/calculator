// A simple calculator application that will add certain strings together and perform BEDMAS operations

import readline from 'node:readline';
import * as process from 'node:process';
import { makeCalculator } from './makeCalculator';

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const calculator = makeCalculator();

const handler = (question: string) => {
  r1.question(question, (answer: string) => {
    if (answer === 'quit') {
      process.exit(0)
    }
    const output = calculator.calculate(answer);
    r1.write(`${output}\n`);
    handler("");
  })
}

handler("0\n");

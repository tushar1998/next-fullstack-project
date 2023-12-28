import { log } from "console";
import chalk from "chalk";

/**
 * !! Should use only on server side
 */
export class Logger {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  log(...message: unknown[]) {
    log(chalk.green(`[${this._name}]:`, ...message));
  }

  info(...message: unknown[]) {
    log(chalk.blue(`[${this._name}]:`, ...message));
  }

  error(...message: unknown[]) {
    log(chalk.red(`[${this._name}]:`, ...message));
  }
}

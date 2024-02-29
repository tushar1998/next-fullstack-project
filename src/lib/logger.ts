import chalk from "chalk";
import { log } from "console";

/**
 * !! Should use only on server side
 */
export class Logger {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  log(...message: unknown[]) {
    log(chalk.green(`[${this.name}]:`, ...message));
  }

  info(...message: unknown[]) {
    log(chalk.blue(`[${this.name}]:`, ...message));
  }

  error(...message: unknown[]) {
    log(chalk.red(`[${this.name}]:`, ...message));
  }
}

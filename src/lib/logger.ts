import { log } from "console"
import chalk from "chalk"

/**
 * !! Should use only on server side
 */
export class Logger {
  private _name: string

  constructor(name: string) {
    this._name = name
  }

  log(...message: string[]) {
    log(chalk.green(`[${this._name}]:`, ...message))
  }

  info(...message: string[]) {
    log(chalk.blue(`[${this._name}]:`, ...message))
  }

  error(...message: string[]) {
    log(chalk.red(`[${this._name}]:`, ...message))
  }
}

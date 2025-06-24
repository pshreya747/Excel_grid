// Command.js

/**
 * Implements Command pattern for undo-redo functionality
 */
export class Command {
  /**
   * @param {Function} execute
   * @param {Function} undo
   */
  constructor(execute, undo) {
    this.execute = execute;
    this.undo = undo;
  }
}

export class CommandManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  executeCommand(command) {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.undoStack.push(command);
    }
  }
}

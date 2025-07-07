// Define a type for our logger so we have consistent function signatures
interface ILogger {
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

const noOp = () => {};

// No-op logger for production
const prodLogger: ILogger = {
  info: noOp,
  warn: noOp,
  error: noOp, 
  debug: noOp,
};

// Real logger for development
const devLogger: ILogger = {
  info: console.log,
  warn: console.warn,
  error: console.error,
  debug: console.log,
};

const logger: ILogger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export default logger; 
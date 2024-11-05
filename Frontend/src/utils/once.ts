import { VoidFn } from './type';

export function once(fn: VoidFn): VoidFn {
  let executed = false;

  return () => {
    if (!executed) {
      executed = true;
      fn();
    }
  };
}

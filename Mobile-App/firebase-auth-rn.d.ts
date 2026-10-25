import 'firebase/auth';

// Firebase v12 ships getReactNativePersistence in the React Native runtime
// bundle but omits it from the public TypeScript definitions.
// https://github.com/firebase/firebase-js-sdk/issues/9316
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): any;
}
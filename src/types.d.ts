// Type overrides for problematic library definitions
declare module '@prisma/client' {
  export * from '@prisma/client/index';
}

declare module '@prisma/extension-accelerate' {
  export function withAccelerate(): any;
}

// Global type overrides
declare global {
  interface RequestInfo {}
  var RequestInfo: {
    prototype: RequestInfo;
    new(): RequestInfo;
  };
}

export {};
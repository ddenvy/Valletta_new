import { useEffect, useLayoutEffect } from 'react';

// На сервере используем useEffect вместо useLayoutEffect
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect; 
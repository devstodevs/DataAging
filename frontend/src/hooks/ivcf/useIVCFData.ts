import { useState, useEffect, useMemo } from 'react';
import { type IVCFFilters } from '../../types/ivcf';
import { type UseIVCFDataReturn } from './types';
import { createInitialState, createStateHelpers } from './state';
import { createAsyncOperationHandler, createDataFetchers } from './operations';
import { createDataProcessors } from './dataProcessors';

export const useIVCFData = (initialFilters: IVCFFilters = {}): UseIVCFDataReturn => {
  const [state, setState] = useState(createInitialState());

  // setState is stable, but we need to recreate handlers when setState changes
  // However, setState from useState is always stable, so we can use it directly
  const handleAsyncOperation = useMemo(
    () => createAsyncOperationHandler(setState),
    [] // setState is stable, no need to include it
  );

  const dataFetchers = useMemo(
    () => createDataFetchers(setState, handleAsyncOperation),
    [handleAsyncOperation] // setState is stable, no need to include it
  );

  const dataProcessors = useMemo(
    () => createDataProcessors(state),
    [state]
  );

  const stateHelpers = useMemo(
    () => createStateHelpers(state),
    [state]
  );

  useEffect(() => {
    dataFetchers.refetchAll(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    ...state,
    ...dataFetchers,
    ...dataProcessors,
    ...stateHelpers,
  };
};
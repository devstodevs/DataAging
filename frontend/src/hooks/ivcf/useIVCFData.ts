import { useState, useEffect } from 'react';
import { type IVCFFilters } from '../../types/ivcf';
import { type UseIVCFDataReturn } from './types';
import { createInitialState, createStateHelpers } from './state';
import { createAsyncOperationHandler, createDataFetchers } from './operations';
import { createDataProcessors } from './dataProcessors';

export const useIVCFData = (initialFilters: IVCFFilters = {}): UseIVCFDataReturn => {
  const [state, setState] = useState(createInitialState());

  const handleAsyncOperation = createAsyncOperationHandler(setState);
  const dataFetchers = createDataFetchers(setState, handleAsyncOperation);
  const dataProcessors = createDataProcessors(state);
  const stateHelpers = createStateHelpers(state);

  useEffect(() => {
    dataFetchers.refetchAll(initialFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    ...dataFetchers,
    ...dataProcessors,
    ...stateHelpers,
  };
};
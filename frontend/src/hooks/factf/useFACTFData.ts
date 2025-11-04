import { useState, useEffect } from 'react';
import { type FACTFFilters } from '../../types/factf';
import { type UseFACTFDataReturn } from './types';
import { createInitialState, createStateHelpers } from './state';
import { createAsyncOperationHandler, createDataFetchers } from './operations';
import { createDataProcessors } from './dataProcessors';

export const useFACTFData = (initialFilters: FACTFFilters = {}): UseFACTFDataReturn => {
  const [state, setState] = useState(createInitialState());

  const handleAsyncOperation = createAsyncOperationHandler(setState);
  const dataFetchers = createDataFetchers(setState, handleAsyncOperation);
  const dataProcessors = createDataProcessors(state);
  const stateHelpers = createStateHelpers(state, setState);

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
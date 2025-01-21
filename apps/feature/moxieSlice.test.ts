import { moxieReducer, moxieSlice } from './moxieSlice';

describe('moxie slice', () => {
  const initialState = {
    selectedWallet: '',
    isClaimRequested: false,
    isClaimSuccess: false,
    isClaimAlertShowing: false,
    isClaimDialogShowing: false,
    isClaimDialogShowingRewards: false,
    filterSelection: 0,
    error: null,
  };

  it('should return initial state', () => {
    expect(moxieReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setSelectedWallet', () => {
    const wallet = '0x123456789';
    const nextState = moxieReducer(initialState, moxieSlice.actions.setSelectedWallet(wallet));
    expect(nextState.selectedWallet).toBe(wallet);
  });

  it('should handle setClaimRequested', () => {
    const nextState = moxieReducer(initialState, moxieSlice.actions.setClaimRequested(true));
    expect(nextState.isClaimRequested).toBe(true);
  });

  it('should handle setClaimSuccess', () => {
    const nextState = moxieReducer(initialState, moxieSlice.actions.setClaimSuccess(true));
    expect(nextState.isClaimSuccess).toBe(true);
  });

  it('should handle setClaimAlertShowing', () => {
    const nextState = moxieReducer(initialState, moxieSlice.actions.setClaimAlertShowing(true));
    expect(nextState.isClaimAlertShowing).toBe(true);
  });

  it('should handle setClaimDialogShowing', () => {
    const nextState = moxieReducer(initialState, moxieSlice.actions.setClaimDialogShowing(true));
    expect(nextState.isClaimDialogShowing).toBe(true);
  });

  it('should handle setClaimDialogShowingRewards', () => {
    const nextState = moxieReducer(
      initialState,
      moxieSlice.actions.setClaimDialogShowingRewards(true)
    );
    expect(nextState.isClaimDialogShowingRewards).toBe(true);
  });

  it('should handle setFilterSelection', () => {
    const filter = 2;
    const nextState = moxieReducer(initialState, moxieSlice.actions.setFilterSelection(filter));
    expect(nextState.filterSelection).toBe(filter);
  });

  it('should handle setError', () => {
    const error = 'Test error message';
    const nextState = moxieReducer(initialState, moxieSlice.actions.setError(error));
    expect(nextState.error).toBe(error);
  });

  it('should handle setError with null', () => {
    // First set an error
    let nextState = moxieReducer(initialState, moxieSlice.actions.setError('Test error'));
    // Then clear it
    nextState = moxieReducer(nextState, moxieSlice.actions.setError(null));
    expect(nextState.error).toBeNull();
  });
}); 
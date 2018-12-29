// App State
export interface IState {
    rows: any[];
}

// State Params
export interface IStateParams {
    state: IState;
}

export const initState = {
    rows: [],
};

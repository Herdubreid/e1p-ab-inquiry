import './css/style.scss';
import * as ko from 'knockout';
import { IState, initState } from './state';
import './components';

const storageKey = 'io-celin-e1p-ab-inquiry';

/**
 * App
 */


class ViewModel {
    constructor(public state: IState) {}
}

// Storage Read
const state = JSON.parse(sessionStorage.getItem(storageKey)) || initState;

const viewModel = new ViewModel(state);

ko.applyBindings(viewModel);

// Storage Save
window.onbeforeunload = () =>
    sessionStorage.setItem(storageKey, JSON.stringify(viewModel.state));

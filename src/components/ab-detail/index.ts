// AB Detail Component
import './style.scss';
import * as ko from 'knockout';

export class ViewModel {
    $busy = ko.observable(true);
    $abDetail = ko.observable<any>(null);
    $whosWho = ko.observable<any[]>(null);
    constructor(params:any) {
        const abDetail = {
            formServiceAction: 'R',
            formName: 'P01012_W01012A',
            returnControlIDs: '21|28|34|36|38|40|42|44|50|52|54|56|62',
            formInputs: [
                {
                    id: '12',
                    value: params.F0101_AN8
                }
            ]
        };
        const whosWho = {
            formServiceAction: 'R',
            formName: 'P0111_W0111A',
            returnControlIDs: '1[9,61,76,78,131]',
            formInputs: [
                {
                    id: '1',
                    value: params.F0101_AN8
                }
            ],
            formActions: [
                {
                    controlID: '73',
                    command: 'SetRadioButton',
                    value: '1'
                }
            ]
        };
        const br = {
            aliasNaming: true,
            outputType: 'VERSION1',
            formRequests: [abDetail, whosWho]
        };
        callAISService(br, BATCH_FORM_SERVICE, (response:any) => {
            this.$abDetail(response.fs_0_P01012_W01012A.data);
            this.$whosWho(response.fs_1_P0111_W0111A.data.gridData.rowset);
            this.$busy(false);
        });
    }
}

ko.components.register('ab-detail', {
    viewModel: { createViewModel: (params) => new ViewModel(params)  },
    template: require('./template.html')
});

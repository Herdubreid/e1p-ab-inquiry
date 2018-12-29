// AB Search Component
import './style.scss';
import * as ko from 'knockout';
import 'datatables.net-select-bs4';
import { IStateParams } from '../../state';
import { ViewModel as ChildVM } from '../ab-detail';

class ViewModel {
    $busy = ko.observable(false);
    $keywords = ko.observable<string>(null);
    table: DataTables.Api;
    abSearchClick = () => {
        if (this.$keywords()) {
            this.$busy(true);
            const condition = this.$keywords()
                .split(' ')
                .filter(keyword => keyword.length > 0)
                .map(keyword => {
                    return {
                        value: [
                            {
                                content: keyword.toUpperCase(),
                                specialValueId: 'LITERAL'
                            }
                        ],
                        controlId: 'F0101.DC',
                        operator: 'STR_CONTAIN'
                    };
                });
            const rq = {
                outputType: 'GRID_DATA',
                aliasNaming: true,
                dataServiceType: 'BROWSE',
                targetName: 'V0101',
                targetType: 'view',
                findOnEntry: 'TRUE',
                returnControlIDs: 'F0101.DC|F0101.ALPH|F0101.AN8|F0101.AT1',
                maxPageSize: '1000',
                query: {
                    condition,
                    autoFind: true,
                    matchType: 'MATCH_ALL'
                }
            };
            callAISService(rq, DATA_SERVICE, response => {
                this.params.state.rows =
                    response.fs_DATABROWSE_V0101.data.gridData.rowset;
                this.table
                    .clear()
                    .rows.add(this.params.state.rows)
                    .draw();
                this.$busy(false);
            });
        }
    };
    constructor(public params: IStateParams) {
        this.table = $('#ab-search-table').DataTable({
            dom: 't',
            scrollY: '70vh',
            paging: false,
            select: {
                style: 'single'
            },
            data: params.state.rows,
            columns: [
                {
                    className: 'details-control closed fa-lg ripple',
                    width: '10%',
                    title: '',
                    orderable: false,
                    data: null,
                    defaultContent: ''
                },
                { title: '&nbsp; Name', width: '60%', data: 'F0101_ALPH' },
                {
                    title: 'Number',
                    width: '15%',
                    className: 'text-right',
                    data: 'F0101_AN8'
                },
                {
                    title: 'T',
                    width: '15%',
                    className: 'text-center',
                    data: 'F0101_AT1'
                }
            ],
            order: [[1, 'asc']]
        });
        this.table.on('init.dt', () => console.log('Draw!'));
        this.table.on('user-select', (e, dt, type, cell) => {
            const node = $(cell.node());
            if (!this.$busy() && node.hasClass('details-control')) {
                const row = cell.row(cell.index().row);
                const child = row.child;
                if (child()) {
                    const slider = $('div.slider', child());
                    if (child.isShown()) {
                        slider.slideUp(() => {
                            child.hide();
                            node.removeClass('open').addClass('closed');
                        });
                    } else {
                        child.show();
                        node.removeClass('closed').addClass('open');
                        slider.slideDown();
                    }
                } else {
                    child(require('../ab-detail/template.html'));
                    const viewModel = new ChildVM(row.data());
                    const s = viewModel.$busy.subscribe(_ => {
                        $('div.content.slider', child()).slideDown();
                        s.dispose();
                    });
                    ko.applyBindings(viewModel, child().get(0));
                    child.show();
                    $('div.working.slider', child()).slideDown();
                    node.removeClass('closed').addClass('open');
                }
            }
        });
    }
}

ko.components.register('ab-search', {
    viewModel: ViewModel,
    template: require('./template.html')
});

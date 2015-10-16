/// <reference path="../typings/underscore/underscore.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/wijmo/wijmo.grid.d.ts" />

module Pa.Grid {
    export class SortHelper {
        static sortingColumn(vm, e) {
            //apply serverside sort by first processing and generating object for view model 
            //to remember sort settings. Use view model sort in readFn
            //http://wijmo.com/topic/flexgrid-force-sort-icon/
            var sort = {};
            // determine new sort
            sort["field"] = e.panel.columns[e.col].name;

            //column correntSort isnt set, will have to dirive from observable
            var currentSort = _.find(vm.sort, function (colsort) {
                return colsort["field"] === e.panel.columns[e.col].name;
            });

            sort["dir"] = "asc";

            if (!(vm.sort)) {
                vm.sort = [];
            }

            if (currentSort) {
                if (vm.allowRemoveSort && currentSort["dir"] === "desc") {
                    //remove current field from sort
                    var index = _.indexOf(vm.sort, currentSort);
                    vm.sort.splice(index, 1);
                } else {
                    sort["dir"] = (currentSort["dir"] === "asc") ? "desc" : "asc";
                    var index = _.indexOf(vm.sort, currentSort);
                    vm.sort[index].dir = sort["dir"];
                }
            } else {
                if (vm.allowMultiColumnSort) {
                    vm.sort.push(sort);
                } else {
                    vm.sort([sort]);
                }
            }

            // update the data using custom sort
            vm.readFn();
        }
    }
    export class FilterHelper {
        static FilterOperator = {
            Contains: "contains",
            DoesNotContain: "doesnotcontain",
            IsNotEqualTo: "neq",
            StartsWith: "startswith",
            IsEqualTo: "eq",
            EndsWith: "endswith",
            IsGreaterThan: "gt",
            IsGreaterThanOrEqualTo: "gte",
            IsLessThan: "lt",
            IsLessThanOrEqualTo: "lte",
            IsContainedIn: "iscontainedin"
        };

        static getFilterOperator(operator) {
            switch (operator) {
                case wijmo.grid.filter.Operator.CT:
                    return FilterHelper.FilterOperator.Contains;
                case wijmo.grid.filter.Operator.NC:
                    return FilterHelper.FilterOperator.DoesNotContain;
                case wijmo.grid.filter.Operator.NE:
                    return FilterHelper.FilterOperator.IsNotEqualTo;
                case wijmo.grid.filter.Operator.BW:
                    return FilterHelper.FilterOperator.StartsWith;
                case wijmo.grid.filter.Operator.EQ:
                    return FilterHelper.FilterOperator.IsEqualTo;
                case wijmo.grid.filter.Operator.EW:
                    return FilterHelper.FilterOperator.EndsWith;
                case wijmo.grid.filter.Operator.GT:
                    return FilterHelper.FilterOperator.IsGreaterThan;
                case wijmo.grid.filter.Operator.GE:
                    return FilterHelper.FilterOperator.IsGreaterThanOrEqualTo;
                case wijmo.grid.filter.Operator.LT:
                    return FilterHelper.FilterOperator.IsLessThan;
                case wijmo.grid.filter.Operator.LE:
                    return FilterHelper.FilterOperator.IsLessThanOrEqualTo;
                default:
                    return FilterHelper.FilterOperator.IsEqualTo;
            }
        }

        static applyFilter(vm, s, e) {
            //A reusable function to process filters, correct them for dataMap 
            //and prepare a view model obtect to hold filters for server queries
            //usage: 
            //this.filter = new wijmo.grid.filter.FlexGridFilter(this.grid);
            //this.filter.filterChanged.addHandler(function (s, e: any) {
            //  Pa.Grid.Filter.applyFilter(self, s, e);
            //}


            //retrieve current filter and add to list to send to server
            //also correct dataMap columns filtering value.
            var cf = vm.filter.getColumnFilter(e.col);
            console.log(s, e, cf);
            e.cancel = true;

            var filter = null;
            var filter1: any = {};
            var filter2: any = {};
            var editColumn = e.panel.columns[e.col];

            //using name because it may more accurately reflect database field name
            //which is what we are filtering on serverside
            filter1["field"] = editColumn.name;
            filter2["field"] = editColumn.name;

            if (cf.conditionFilter.isActive) {
                if (cf.conditionFilter.condition1.isActive) {
                    filter1.logic = "or";
                    if (cf.conditionFilter.and) {
                        filter1.logic = "and";
                    }

                    filter1.operator = Pa.Grid.FilterHelper.getFilterOperator(cf.conditionFilter.condition1.operator);
                    filter1.value = cf.conditionFilter.condition1.value;
                    if (editColumn.dataMap) {
                        //value being displayed is not value to filter on
                        var selectedItem = _.find(editColumn.dataMap.collectionView.items, function (item: any) {
                            return item.value == cf.conditionFilter.condition1.value;
                        });
                        if (selectedItem) {
                            filter1.value = selectedItem.value;
                            //this is necessary because filter doesnt work properly with dataMap.  Value is correctly assigned but not applied. 
                            //They have sort working so it sorts on display value and Im wondering it they did same for filter
                            //this changes the value to be that of the text of the dataMap
                            cf.conditionFilter.condition1.value = selectedItem.text;
                        }
                    }
                }

                if (cf.conditionFilter.condition2.isActive) {
                    filter2.logic = "or";
                    if (cf.conditionFilter.and) {
                        filter2.logic = "and";
                    }
                    filter2.operator = Pa.Grid.FilterHelper.getFilterOperator(cf.conditionFilter.condition2.operator);
                    filter2.value = cf.conditionFilter.condition2.value;
                    if (editColumn.dataMap) {
                        //value being displayed is not value to filter on
                        var selectedItem = _.find(editColumn.dataMap.collectionView.items, function (item: any) {
                            return item.value == cf.conditionFilter.condition2.value;
                        });
                        if (selectedItem) {
                            filter2.value = selectedItem.value;
                            //this is necessary because filter doesnt work properly with dataMap.  Value is correctly assigned but not applied. 
                            //They have sort working so it sorts on display value and Im wondering it they did same for filter
                            //this changes the value to be that of the text of the dataMap
                            cf.conditionFilter.condition2.value = selectedItem.text;
                        }
                    }
                }

                filter = {};
                filter.logic = "and";
                filter.filters = [];
                if (cf.conditionFilter.condition1.isActive && cf.conditionFilter.condition2.isActive) {
                    filter.filters.push(filter1);
                    filter.filters.push(filter2);
                }
                else if (cf.conditionFilter.condition1.isActive) {
                    filter = filter1;
                }
                else if (cf.conditionFilter.condition2.isActive) {
                    filter = filter2;
                }
            }

            if (!(vm.filters)) {
                vm.filters = [];
            }

            //clear out current filter
            var currentFilter = _.find(vm.filters, function (filter: any) {
                if (filter.field) {
                    return filter.field === e.panel.columns[e.col].name;
                } else {
                    return filter.filters[0].field === e.panel.columns[e.col].name;
                }
            });
            if (currentFilter) {
                var filterIndex = _.indexOf(vm.filters, currentFilter);
                vm.filters.splice(filterIndex, 1);

                //could be two
                currentFilter = _.find(vm.filters, function (filter: any) {
                    if (filter.field) {
                        return filter.field === e.panel.columns[e.col].name;
                    } else {
                        return filter.filters[0].field === e.panel.columns[e.col].name;
                    }
                });
                if (currentFilter) {
                    filterIndex = _.indexOf(vm.filters, currentFilter);
                    vm.filters.splice(filterIndex, 1);
                }
            }
            if (filter) {
                if (vm.filters.length === 0) {
                    if (filter.filters) {
                        _.each(filter.filters, function (myfilter) {
                            vm.filters.push(myfilter);
                        });
                    } else {
                        vm.filters.push(filter);
                    }
                }
                else {
                    vm.filters.push(filter);
                }
            }
            vm.readFn();
        }
    }

    export class Helpers {
        static alignUserColumnPreferences = (columnDefaults, columnPreferences) => {
            if (columnPreferences === null) {
                return columnDefaults;
            }
            //loop through user preferences as the order may govern column ordering  
            var columns = [];

            //handle columns that might have been added since the last time the grid was shown
            _.each(columnDefaults, function (item: any) {
                //default column will always contain
                var columnDefault = _.findWhere(columnPreferences, { name: item.name });
                //if default column does not exist for field, then it is obsolete
                //also somehow more columns got assignewd to grid than should, so in this case im 
                //making sure a duplicate doesnt get in to the mix by checking to see if already added
                if (_.isUndefined(columnDefault)) {
                    columns.push(item);
                }
                else {
                    columns.push(Pa.Grid.Helpers.buildColumn(item, columnDefault));
                }
            });
            return columns;
        }

        static getRequest(dataSource, options) {
            //grid defintition sent to server needs to tell server how to act. grid knows how to act.
            var request: any = {};
            if (dataSource.options.serverAggregates && dataSource.options.serverAggregates === true) {
                request.aggregate = dataSource.aggregate();
            }
            if (dataSource.options.serverPaging && dataSource.options.serverPaging === true) {
                request.page = options.page;
                request.pageSize = options.pageSize;
            }
            if (dataSource.options.serverSorting && dataSource.options.serverSorting === true) {
                request.sort = options.sort;
            }
            if (dataSource.options.serverFiltering && dataSource.options.serverFiltering === true) {
                request.filter = options.filter;
            }
            if (dataSource.options.serverGrouping && dataSource.options.serverGrouping === true) {
                if (options.group) {
                    if (dataSource.options.serverAggregates && dataSource.options.serverAggregates === true) {
                        request.group = options.group;
                    } else {
                        //need to remove aggregates from group defintition so that server doesnt do aggregates

                        if (dataSource.group.length && dataSource.group.length > 1) {
                            request.group = { binding: options.group.field, dir: options.group.dir }
                        } else {
                            request.group = [];
                            _.each(options.group, function(group: any) {
                                request.group.push({ binding: group.field, dir: group.dir });
                            });
                        }
                    }
                }
            }
            return request;
        }

        static buildColumn(columnDefaults, columnPreferences) {
            var column = _.clone(columnDefaults);

            //adjust column by altering for user preferences
            if (_.has(columnPreferences, "width")) {
                column.width = columnPreferences.width;
            }
            if (_.has(columnPreferences, "visible")) {
                column.visible = columnPreferences.visible;
            }

            return column;
        }

        static handlePreferences(grid, gridId) {
            if (gridId === null || gridId === undefined || gridId === "") {
                return;
            }

            //Only save those properties that we want to allow users to save to conserve space in local storage
            var columns = [];
            _.each(grid.columns, function(column: any) {
                //default column will always contain
                columns.push({
                    name: column.name,
                    binding: column.binding,
                    width: column.width,
                    visible: column.visible
                });
            });

            //not bound by version so send version null
            Pa.Storage.setVersionedData(gridId, columns, null);
        }

        static getSelectedRows(grid, self) {
            //http://wijmo.com/topic/flexgrid-force-sort-icon/
            var rows = grid.rows;

            self.selectedRows.beginUpdate();
            self.selectedRows.clear();
            for (var i = rows.length - 1; i >= 0; i--) {
                if (rows[i].isSelected && rows[i].dataItem) {
                     self.selectedRows.push(rows[i].dataItem);
                }
            }
            self.selectedRows.endUpdate();

            return;
        }

        static getCurrentRow(grid) {
            //currentItem does not change if CTRL selected
            var currentItem: any = grid.collectionView.currentItem;
            return currentItem;
        }
    }

    export class FundListGrid {
        gridIdentifier: string;
        $parent: any;
        static widthLargeText = 225;
        static widthSmallText = 125;
        static defaultWidth = 200;
        
        constructor(identifier, self) {
            this.gridIdentifier = identifier;
            this.$parent = self;
        }

        create(vm, grid, options) {
            var self = this;
            grid.initialize(options);
            grid.sortingColumn.addHandler(function(e) {
                Pa.Grid.SortHelper.sortingColumn(self.$parent, e);
            });
            grid.selectionChanged.addHandler(function (e) {
                //http://wijmo.com/topic/flexgrid-force-sort-icon/
                Pa.Grid.Helpers.getSelectedRows(self.$parent.grid, self.$parent);
                vm.currentRow = Pa.Grid.Helpers.getCurrentRow(vm.grid);
            });
            grid.resizedColumn.addHandler(function (e) {
                Pa.Grid.Helpers.handlePreferences(self.$parent.grid, self.$parent.id);
            });
            grid.draggedColumn.addHandler(function (e) {
                Pa.Grid.Helpers.handlePreferences(self.$parent.grid, self.$parent.id);
            });

            //this.createMStarEditor(grid.columns.getColumn('m255RatingValue'));
            //this.createMStarEditor(grid.columns.getColumn('m36RatingValue'));
            //this.createMStarEditor(grid.columns.getColumn('m60RatingValue'));
            //this.createMStarEditor(grid.columns.getColumn('m120RatingValue'));
        }

        defaultOptions(vm, scoringTools) {
           // var columns = Pa.Grid.FundListGrid.columnDef(scoringTools, vm.id);
          //  console.log("applied columns", columns);
            return {
                autoGenerateColumns: false,
                allowSorting: true,
                showSort: true,
                //frozenColumns: 5,
                //isReadOnly: false,
                selectionMode: wijmo.grid.SelectionMode.ListBox,
                itemFormatter: function(panel, r, c, cell) {
                    if (panel.cellType === wijmo.grid.CellType.ColumnHeader) {
                        var col = panel.columns[c];
                        _.forEach(vm.sort, function(sort) {
                            if (sort["field"] === col.name) {
                                if (sort["dir"] === "asc") {
                                    cell.innerHTML = col.header + ' <span class="wj-glyph-up"></span>';
                                } else {
                                    cell.innerHTML = col.header + ' <span class="wj-glyph-down"></span>';
                                }
                            }
                        });
                    }
                    var mstarcells: any = ["m255RatingValue", "m36RatingValue", "m60RatingValue", "m120RatingValue"];

                    if (panel.cellType === wijmo.grid.CellType.Cell && _.contains(mstarcells, panel.columns[c].name)) {
                        cell.innerHTML = Pa.Grid.FundListTemplates.mstars(panel.grid.getCellData(r, c, false));
                    }
                }//,
              //  columns: columns
            };
        }

        createMStarEditor(editColumn) {
            var grid = editColumn.grid;

            grid.formatItem.addHandler(function (s, e) {
                var editRange = grid.editRange,
                    column = e.panel.columns[e.col];
                // check whether this is an editing cell of the wanted column
                if (!(e.panel.cellType === wijmo.grid.CellType.Cell && column === editColumn && editRange && editRange.row === e.row && editRange.col === e.col)) {
                    return;
                }

                // hide standard editor (don't remove!)
                if (e.cell.firstChild) {
                    e.cell.firstChild.style.display = 'none';
                }
            
                // add custom editor
                var editorRoot = document.createElement('div');
                var isrc = editColumn.dataMap.collectionView;

                var cmb = new wijmo.input.ComboBox(
                    editorRoot, {
                        itemsSource: isrc
                        , isContentHtml: true
                        , itemFormatter: Pa.Grid.FundListTemplates.mstars //customItemFormatter.bind(this)
                        , selectedIndexChanged: function(e) {
                            cmb.inputElement.placeholder = cmb.itemsSource.items[cmb.selectedIndex].text;
                        }
                    });
  
                if (e.cell.children.length > 0) {
                    e.cell.insertBefore(editorRoot, e.cell.firstChild);
                }
                else {
                    e.cell.appendChild(editorRoot);
                }

                var s = grid.getCellData(e.row, e.col, false);
                
                //bug as best I can tell requires setting all of these
                cmb.selectedValuePath = "value";
                cmb.displayMemberPath = "text";
                cmb.selectedIndex = s * 1;
                cmb.selectedValue = s * 1;
                cmb.selectedItem = cmb.itemsSource.items[s * 1];
                
                // cmb.inputElement.value = formatText(s*1);  //this makes the item not selectable, probabgly shouldnt do it this way anyway, though it does show the text and will keep current selection
                //cmb.inputElement.value = cmb.itemsSource.items[s*1].value;
                cmb.inputElement.placeholder = cmb.itemsSource.items[s * 1].text;
								
                // cellEditEnding that updates cell with user's input
                var editEndingEH = function (s, args) {
                    grid.cellEditEnding.removeHandler(editEndingEH);
                    if (!args.cancel) {
                        args.cancel = true;
                        //http://wijmo.com/topic/how-to-set-a-value-in-a-flex-grid-column-with-a-datamap/
                        //have to put in display value due to bug when using dataMap
                        grid.setCellData(e.row, e.col, cmb.itemsSource.items[cmb.selectedIndex].text);
                        cmb.inputElement.placeholder = cmb.itemsSource.items[cmb.selectedIndex].text;
                    }
                };

                // subscribe the handler to the cellEditEnding event
                grid.cellEditEnding.addHandler(editEndingEH);
            });
        }

        static setColumnDef(scoringTools, gridIdentifier, grid) {
            var hideSomeColumns = true;

            var arrMStarValues = [
                { text: "", value: 0 },
                { text: "1 star", value: 1 },
                { text: "2 stars", value: 2 },
                { text: "3 stars", value: 3 },
                { text: "4 stars", value: 4 },
                { text: "5 stars", value: 5 }
            ];

            //<i class='fa fa-star'></i>
            var mstarDataMap = new wijmo.grid.DataMap(arrMStarValues, "value", "text");

            var widthSmallText = this.widthSmallText;
            var defaultWidth = this.defaultWidth;
            var widthLargeText = this.widthLargeText;

            var columns = [
                //{ binding: 'chart_selected', header: "Chart", width: 75, template: "<input type='checkbox' #= chart_selected ? checked='checked': '' # class='chkbx' />", filterable: false, groupable: false, visible: true, allowSorting: false, attributes: { style: 'text-align:center;' } },
                // <i data-ng-class="{'fa fa-check' : (submenu.typeCd==2), 'fa fa-info-circle sign' : (submenu.typeCd==4 || submenu.typeCd==1 || submenu.typeCd==3 || submenu.typeCd==0), 'fa fa-times-circle' : submenu.typeCd==5}"></i>

                { binding: "scoreRange", header: " ", width: 75, filterable: false, groupable: false, visible: scoringTools, allowSorting: false, menu: false },
                { binding: "scorePercentage", header: "Score", filterable: false, groupable: false, visible: scoringTools, allowSorting: false, menu: false, width: 100 },
                { binding: "scorePoints", header: "Points", filterable: false, groupable: false, visible: scoringTools, allowSorting: false, menu: false, width: 100 },
                { binding: "legalName", header: "Fund Name", required: true, filterable: true, groupable: false, visible: true, allowSorting: true, menu: false, width: widthLargeText },
                { binding: "ticker", header: "Ticker", filterable: true, groupable: false, visible: true, allowSorting: true, menu: false, width: widthSmallText },
                { binding: "category", header: "Morningstar Category", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                //this column has an example of aggregates , aggregates: ["sum"], footerTemplate: "Sum: #=sum#"
                { binding: "netExpenseRatio", format: "{0:n2}", header: "Net Expense Ratio %", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.expenseRatio", format: "{0:n2}", header: "Category Net Expense Ratio %", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m36ReturnValue", format: "{0:n2}", header: 'Total Return Annualized 3 Yr', filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m36ReturnValue", format: "{0:n2}", header: "Category 3 Yr Annualized Return", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m36ReturnCatSize", format: "{0:n2}", header: "Category 3 Yr Return Size", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60ReturnValue", format: "{0:n2}", header: "Total Return Annualized 5 Yr", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m60ReturnValue", format: "{0:n2}", header: "Category 5 Yr Annualized Return", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m60ReturnCatSize", format: "{0:n2}", header: "Category 5 Yr Return Size", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m120ReturnValue", format: "{0:n2}", header: "Total Return Annualized 10 Yr", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m120ReturnValue", format: "{0:n2}", header: "Category 10 Yr Annualized Return", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m120ReturnCatSize", format: "{0:n2}", header: "Category 10 Yr Return Size", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "balance", header: 'Balance', filterable: true, groupable: true, visible: false, allowSorting: true, menu: true, width: defaultWidth },
                //  { binding: 'feedDateId', header: 'feedDateId', filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                //  { binding: 'companyId', header: 'companyId', filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                //  { binding: 'fscId', header: 'fscId', filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "cusip", header: "Cusip", required: true, filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: 'legalTypeCd', header: 'legalTypeCd', required: true, validation: { required: true}, filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "primaryIndexId", header: "Standard Index", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "secondaryIndexId", header: "Category Index", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m0ReturnValue", format: "{0:n2}", header: "Total Return YTD", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m0ReturnValue", format: "{0:n2}", header: "Category YTD Return", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m0ReturnCatSize", format: "{0:n2}", header: "Category YTD Return Size", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m0ReturnRank", format: "{0:n2}", header: "% Rank Category YTD", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m3ReturnValue", format: "{0:n2}", header: "Total Return 3 Month", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m12ReturnValue", format: "{0:n2}", header: "Total Return 12 Month", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m12ReturnValue", format: "{0:n2}", header: "Category 12 Mo Return", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m12ReturnCatSize", format: "{0:n2}", header: "Category 12 Mo Return Size", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m12ReturnRank", format: "{0:n2}", header: "% Rank Category 1 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m36ReturnRank", format: "{0:n2}", header: "% Rank Category 3 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60ReturnRank", format: "{0:n2}", header: "% Rank Category 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m120ReturnRank", format: "{0:n2}", header: "% Rank Category 10 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m12SharpeRatio", format: "{0:n2}", header: "Sharpe Ratio 1 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m36SharpeRatio", format: "{0:n2}", header: "Sharpe Ratio 3 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m36SharpeRatio", format: "{0:n2}", header: "Category Sharpe Ratio 3 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60SharpeRatio", format: "{0:n2}", header: "Sharpe Ratio 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m60SharpeRatio", format: "{0:n2}", header: "Category Sharpe Ratio 5 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m120SharpeRatio", format: "{0:n2}", header: "Sharpe Ratio 10 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m120SharpeRatio", format: "{0:n2}", header: "Category Sharpe Ratio 10 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m12StandardDeviation", format: "{0:n2}", header: "Standard Deviation 1 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m36StandardDeviation", format: "{0:n2}", header: "Standard Deviation 3 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m36StandardDeviation", format: "{0:n2}", header: "Category Standard Deviation 3 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60StandardDeviation", format: "{0:n2}", header: "Standard Deviation 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m60StandardDeviation", format: "{0:n2}", header: "Category Standard Deviation 5 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m120StandardDeviation", format: "{0:n2}", header: "Standard Deviation 10 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m120StandardDeviation", format: "{0:n2}", header: "Category Standard Deviation 10 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },

                { binding: "m255RatingValue", showDropDown: false, isContentHtml: true, isReadOnly: false, header: "MStar Rating*", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m36RatingValue", showDropDown: false, isContentHtml: true, isReadOnly: false, header: "MStar Rating 3 Yr*", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60RatingValue", showDropDown: false, isContentHtml: true, isReadOnly: false, header: "MStar Rating 5 Yr*", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m120RatingValue", showDropDown: false, isContentHtml: true, isReadOnly: false, header: "MStar Rating 10 Yr*", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                
                { binding: "m36PerfRatingDesc", format: "{0:n2}", header: "MStar Return 3 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60PerfRatingDesc", format: "{0:n2}", header: "MStar Return 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m120PerfRatingDesc", format: "{0:n2}", header: "MStar Return 10 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m36RiskRatingDesc", format: "{0:n2}", header: "MStar Risk 3 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60RiskRatingDesc", format: "{0:n2}", header: "MStar Risk 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m120RiskRatingDesc", format: "{0:n2}", header: "MStar Risk 10 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m12AlphaPrimary", format: "{0:n2}", header: "Alpha 1 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m36AlphaPrimary", format: "{0:n2}", header: "Alpha 3 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m36AlphaPrimary", format: "{0:n2}", header: "Category Alpha 3 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60AlphaPrimary", format: "{0:n2}", header: "Alpha 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m60AlphaPrimary", format: "{0:n2}", header: "Category Alpha 5 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m120AlphaPrimary", format: "{0:n2}", header: "Alpha 10 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m120AlphaPrimary", format: "{0:n2}", header: "Category Alpha 10 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m12BetaPrimary", format: "{0:n2}", header: "Beta 1 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m36BetaPrimary", format: "{0:n2}", header: "Beta 3 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m36BetaPrimary", format: "{0:n2}", header: "Category Beta 3 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60BetaPrimary", format: "{0:n2}", header: "Beta 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m60BetaPrimary", format: "{0:n2}", header: "Category Beta 5 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m120BetaPrimary", format: "{0:n2}", header: "Beta 10 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m120BetaPrimary", format: "{0:n2}", header: "Category Beta 10 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m12RSquaredPrimary", format: "{0:n2}", header: "R-Squared 1 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m36RSquaredPrimary", format: "{0:n2}", header: "R-Squared 3 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m36RSquaredPrimary", format: "{0:n2}", header: "Category R-Squared 3 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60RSquaredPrimary", format: "{0:n2}", header: "R-Squared 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m60RSquaredPrimary", format: "{0:n2}", header: "Category R-Squared 5 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m120RSquaredPrimary", format: "{0:n2}", header: "R-Squared 10 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m120RSquaredPrimary", format: "{0:n2}", header: "Category R-Squared 10 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                //  { binding: "m12InfoRatio", header: "m12InfoRatio", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                //  { binding: "m36InfoRatio", header: "m36InfoRatio", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                //  { binding: "m60InfoRatio", header: "m60InfoRatio", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "m120InfoRatio", header: "m120InfoRatio", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60CaptureRatioUp", format: "{0:n2}", header: "Upside Capture Ratio 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60CaptureRatioDown", format: "{0:n2}", header: "Downside Capture Ratio 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "m60BattingAverage", format: "{0:n2}", header: "Batting Average 5 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.m60BattingAverage", format: "{0:n2}", header: "Category Batting Average 5 Yr", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "netAssets", format: "{0:n2}", header: "Net Assets", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.netAssets", format: "{0:n2}", header: "Category Net Assets", filterable: true, groupable: false, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "turnoverRatio", format: "{0:n2}", header: "Turnover Ratio", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.turnoverRatio", format: "{0:n2}", header: "Category Turnover Ratio", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "numberOfHolding", format: "{0:n2}", header: "Total Number Of Holdings", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "top10HoldingWeighting", header: "top10HoldingWeighting", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "managerTenure", format: "{0:n2}", header: "Manager Tenure (longest)", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "categoryDetail.managerTenure", format: "{0:n2}", header: "Category Manager Tenure", filterable: true, groupable: false, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "pctLargeValue", header: "pctLargeValue", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                //  { binding: "pctLargeBlend", header: "pctLargeBlend", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "pctLargeGrowth", header: "pctLargeGrowth", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "pctMidValue", header: "pctMidValue", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                //  { binding: "pctMidBlend", header: "pctMidBlend", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "pctMidGrowth", header: "pctMidGrowth", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "pctSmallValue", header: "pctSmallValue", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "pctSmallBlend", header: "pctSmallBlend", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "pctSmallGrowth", header: "pctSmallGrowth", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "assetAllo", format: "{0:n2}", header: "Total Return 10 Yr", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "assetAlloBlend", header: "assetAlloBlend", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "inceptionDate", header: "Fund Inception Date", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "annualReportDate", header: "annualReportDate", template: "#= kendo.toString(kendo.parseDate(annualReportDate, "yyyy-MM-dd"), "MM/dd/yyyy") #", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "portfolioReportDate", header: "portfolioReportDate", template: "#= kendo.toString(kendo.parseDate(portfolioReportDate, "yyyy-MM-dd"), "MM/dd/yyyy") #", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                // { binding: "netAssetsReportDate", header: "netAssetsReportDate", template: "#= kendo.toString(kendo.parseDate(netAssetsReportDate, "yyyy-MM-dd"), "MM/dd/yyyy") #", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                //{ binding: "primaryIndex", header: "primaryIndex", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                //{ binding: "secondaryIndex", header: "secondaryIndex", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth },
                { binding: "fundFamily", header: "Fund Family", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth }
                //,{ binding: "morningstarObjective", header: "morningstarObjective", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth }
                //,{ binding: "strategy", header: "strategy", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth }
                //,{ binding: "actual12b1", header: "actual12b1", filterable: true, groupable: true, visible: !hideSomeColumns, allowSorting: true, menu: true, width: defaultWidth }
            ];

            //for wijmo column definition

            _.each(columns, function (column: any) {
                column.name = column.binding;
                //these are left in until I find a replacement for how kendo deals with these
                delete column.filterable;
                delete column.groupable;
                delete column.menu;
            });

             var gridId = gridIdentifier;
             
             var columnPreferences = Pa.Storage.getVersionedData(gridId, null, null);
             if (columnPreferences) {
                 
                 //Alter these defaults by user preferences that are in local storage
                 var alteredColumns = Pa.Grid.Helpers.alignUserColumnPreferences(columns, columnPreferences);
                 //If need to reset preference structure due to error
                 //storageSvc.clear();
                 if (!alteredColumns || alteredColumns.length === 0) {
                     //something wrong with memory, clear this object
                     Pa.Storage.setVersionedData(gridId, null, null);
                     //Pa.Storage.clear();
                 } else {
                     columns = alteredColumns;
                 }
             }
             if (!columns || columns.length === 0) {
                 alert("No columns defined!");
             }

            var columnCollection = grid.columns; //new wijmo.grid.ColumnCollection(grid, 0);
             for (let i = 0; i < columns.length; i++) {
                 var c = new wijmo.grid.Column(columns[i]);
                 if (c.binding === "m255RatingValue" || c.binding === "m36RatingValue" || c.binding === "m60RatingValue" || c.binding === "m120RatingValue") {
                     c.dataMap = mstarDataMap;
                 }
                 //{ binding: "m255RatingValue", showDropDown: false, isContentHtml: true, isReadOnly: false, dataMap: mstarDataMap, header: "MStar Rating*", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                 //{ binding: "m36RatingValue", showDropDown: false, isContentHtml: true, isReadOnly: false, dataMap: mstarDataMap, header: "MStar Rating 3 Yr*", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                 //{ binding: "m60RatingValue", showDropDown: false, isContentHtml: true, isReadOnly: false, dataMap: mstarDataMap, header: "MStar Rating 5 Yr*", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                 //{ binding: "m120RatingValue", showDropDown: false, isContentHtml: true, isReadOnly: false, dataMap: mstarDataMap, header: "MStar Rating 10 Yr*", filterable: true, groupable: true, visible: true, allowSorting: true, menu: true, width: defaultWidth },
                

                 columnCollection.push(c);
             }
            var s = "s";
            //  return columns;
        }
    }




    export class FundListTemplates {
        static mstars(content) {
            let s = ""; 
            //requires font-awesome
            //<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
            //<i class='fa fa-star' ng-repeat='star in dvm.stars'></i>
            if (content) {
                var count = content * 1;
                for (let i = 0; i < count; i++) {
                    s = s + "<i class='fa fa-star'></i>";
                }  
            }
            return s;
        }
    }
}
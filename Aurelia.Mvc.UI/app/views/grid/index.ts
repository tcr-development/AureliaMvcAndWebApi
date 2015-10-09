/// <reference path="wijmogrid.ts" />
/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="multiobserver.ts" />

import { inject} from "aurelia-framework";
import Observer = require("app/views/grid/multiObserver");
import Wijmogrid = require("wijmogrid");

export class Search{
    static inject() { return [Observer.MultiObserver]; }
   // @bindable grid1: any;
    dispose: () => void;
    multiObserver;
    grid1: Wijmogrid.WijmoGrid;
    grid1State: any = { activated: false };
    grid2State: any = { activated: false };
    count = 0;
    constructor(multiObserver) {
        this.multiObserver = multiObserver;
   }

    activate() {
        var self = this;
        self.dispose = self.multiObserver.observe(
            [[self.grid1State, 'activated']],
            () => self.observeGrid());
    }


   selectedRowsChanged() {
       //this.$parent.count = this.selectedRows.length;
   }

   observeGrid() {
       if (!this.grid1) {
           return 0;
       }
       var self = this;
       self.dispose = self.multiObserver.observe(
           [[self.grid1.selectedRows, 'length']],
           () => self.updateCount());

       this.updateCount();
   }

   updateCount() {
       if (!this.grid1) {
           return 0;
       }

       this.count = this.grid1.selectedRows.length;
   }

   deactivated() {
       this.dispose();
   }


}

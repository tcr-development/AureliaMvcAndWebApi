/// <reference path="wijmogrid.ts" />
/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="multiobserver.ts" />

import { inject} from "aurelia-framework";
import Observer = require("app/views/grid/multiObserver");
import Wijmogrid = require("wijmogrid");

export class Index{
    static inject() { return [Observer.MultiObserver]; }
    dispose: () => void;
    multiObserver;
    grid1: Wijmogrid.WijmoGrid;
    grid2: Wijmogrid.WijmoGrid;
    grid1State: any = { activated: false };
    grid2State: any = { activated: false };
    count = 0;
    eventCount = 0;
    constructor(multiObserver) {
        this.multiObserver = multiObserver;
   }

    activate() {
        var self = this;
        //watch for a change that will indicate the grid object is available
        //inside the custom grid element
        self.dispose = self.multiObserver.observe(
            [[self.grid1State, 'activated']],
            () => self.setEventHandler());
    }

    attached() {
        var self = this;
        self.dispose = self.multiObserver.observe(
            [[self.grid1.selectedRows, 'length']],
            () => self.updateCount());
    }

    setEventHandler() {
        var self = this;
        self.grid1.grid.selectionChanged.addHandler(function(s, e) {
            self.updateEventCount();
        });        
   }
    updateEventCount() {
        if (!this.grid1) {
            return 0;
        }
        this.eventCount = this.grid1.selectedRows.length;
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

import {ObserverLocator} from 'aurelia-framework'; // or 'aurelia-binding'

export class MultiObserver {
    static inject() { return [ObserverLocator]; }
    observerLocator;
    constructor(observerLocator) {
        this.observerLocator = observerLocator;
    }

    observe(properties, callback) {
        var subscriptions = [], i = properties.length, object, propertyName;
        while (i--) {
            object = properties[i][0];
            propertyName = properties[i][1];
            subscriptions.push(this.observerLocator.getObserver(object, propertyName).subscribe(callback));
        }

        // return dispose function
        return () => {
            while (subscriptions.length) {
                subscriptions.pop()();
            }
        }
    }
}
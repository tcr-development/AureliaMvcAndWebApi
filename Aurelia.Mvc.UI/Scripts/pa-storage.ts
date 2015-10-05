/// <reference path="../typings/modernizr.d.ts" />

module Pa {
    export class Storage{
        static remove(key) {
            if (Modernizr.localstorage) {
                // window.localStorage is available!
                localStorage.removeItem(key);
            }
        }

        static clear() {
            if (Modernizr.localstorage) {
                // window.localStorage is available!
                localStorage.clear();
            }
        }

        static  getAppVersion() {
            return this.getVersionedData("app.version", null, 0);
        }

        static getVersionedData(key, versionNumber, defaultValue) {
            if (Modernizr.localstorage) {
                // window.localStorage is available!
                var jsonValue = localStorage.getItem(key);
                if (jsonValue && jsonValue !== "") {
                    var versionedData = JSON.parse(jsonValue);
                    if (versionedData.version === versionNumber || versionNumber == null) {
                        return versionedData.data;
                    }
                }
            }
            return defaultValue;
        }

        static setVersionedData(key, value, versionNumber) {
            if (Modernizr.localstorage) {
                var versionedData = { version: versionNumber, data: value }
                localStorage.setItem(key, JSON.stringify(versionedData));
                return true;
            }
            return false;
        }

        static getAppVersionedData(key, defaultValue) {
            var version = this.getAppVersion();

            return this.getVersionedData(key, version, defaultValue);
        }

        static setAppVersionedData(key, value) {
            var version = this.getAppVersion();
            return this.setVersionedData(key, value, version);
        }

        static getSetting(key, defaultValue) {
            return this.getVersionedData(key, null, defaultValue);
        }

        static setSetting(key, value) {
            return this.setVersionedData(key, value, null);
        }
    }


    export class Common {
        /**
        * A convenience method for detecting a legitimate non-null value.
        * Returns false for null/undefined/NaN/Infinity, true for other values,
        * including 0/false/''
        */
        isValue(val) {
            return !(val === null || val === undefined || isNaN(val) || !isFinite(val));
        }
    }
}
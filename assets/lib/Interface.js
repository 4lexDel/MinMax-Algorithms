class Interface {

    constructor(name, ...methods) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('The "name" argument must be a non-empty string')
        }
        if (!Array.isArray(methods) || methods.length === 0) {
            throw new Error('The "methods" argument must be a non-empty array of string')
        }

        this.name = name
        this.methods = []
        for (let method of methods) {
            if (typeof method !== 'string') {
                throw new Error('The "methods" argument must contains only string')
            }
            this.methods.push(method)
        }
    }

    static checkImplements(object, ...interfaces) {
        if (!Array.isArray(interfaces) || interfaces.length === 0) {
            throw new Error('The "interfaces" argument must be a non-empty array of Interface')
        }

        for (let itf of interfaces) {
            if (itf.constructor !== Interface) {
                throw new Error('The "interfaces" argument must contains instances of Interface')
            }

            const missingMethods = [];
            for (let method of itf.methods) {
                if (!object[method] || typeof object[method] !== 'function') {
                    missingMethods.push(method);
                }
            }

            if (missingMethods.length > 0) {
                throw new Error(`The object doesn't implement the ${itf.name} interface. Methods not found : ${missingMethods.join(', ')}`);
            }
        }
    }
}
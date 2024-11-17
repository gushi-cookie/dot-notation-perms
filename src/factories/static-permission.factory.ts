import { StaticPermission } from '../interfaces/permissions.interface';


/**
 * Factory class for the StaticPermission type.
 */
export class StaticPermissionFactory {
    private permission: StaticPermission;

    constructor(key: string) {
        this.permission = {
            key,
            requiredParams: [],
            optionalParams: [],
            nodes: [],
        }
    }


    /**
     * Create an instance of a StaticPermission type.
     * @param key - the permission's key.
     * @returns a static permission.
     */
    static fromKey(key: string): StaticPermission {
        return {
            key,
            requiredParams: [],
            optionalParams: [],
            nodes: [],
        }
    }

    /**
     * Add the factory permission to child nodes list of a parent permission.
     * @param parent - parent permission.
     * @returns factory chain.
     */
    setParent(parent: StaticPermission): StaticPermissionFactory {
        parent.nodes.push(this.permission);
        return this;
    }

    /**
     * Add a child permission to the permission of the factory.
     * @param permission - permission to add.
     * @returns factory chain.
     */
    addPermission(permission: StaticPermission): StaticPermissionFactory {
        this.permission.nodes.push(permission);
        return this;
    }

    /**
     * Add a child permissions array to the permission of the factory.
     * @param permissions - permissions array.
     * @returns factory chain.
     */
    addPermissions(permissions: StaticPermission[]): StaticPermissionFactory {
        for(let perm of permissions) {
            this.permission.nodes.push(perm);
        }
        return this;
    }

    /**
     * Add a required parameter to the factory permission.
     * @param name - name of the parameter.
     * @returns factory chain.
     */
    addRequiredParam(name: string): StaticPermissionFactory {
        if(!this.permission.requiredParams.includes(name)) {
            this.permission.requiredParams.push(name);
        }
        return this;
    }

    /**
     * Add a list of required parameters to the factory permission.
     * @param names - list of parameter names.
     * @returns factory chain.
     */
    addRequiredParams(names: string[]): StaticPermissionFactory {
        for(let name of names) {
            this.addRequiredParam(name);
        }
        return this;
    }

    /**
     * Add an optional parameter to the factory permission.
     * @param name - name of the parameter.
     * @returns factory chain.
     */
    addOptionalParam(name: string): StaticPermissionFactory {
        if(!this.permission.optionalParams.includes(name)) {
            this.permission.optionalParams.push(name);
        }
        return this;
    }

    /**
     * Add a list of optional parameters to the factory permission.
     * @param names - list of parameter names.
     * @returns factory chain.
     */
    addOptionalParams(names: string[]): StaticPermissionFactory {
        for(let name of names) {
            this.addOptionalParam(name);
        }
        return this;
    }

    /**
     * Create an instance of a static permission according to the specified parameters.
     * @returns a static permission.
     */
    build(): StaticPermission {
        return structuredClone(this.permission);
    }
}
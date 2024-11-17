import { StaticPermission } from '../interfaces/permissions.interface';
import nodesUtil from '../utils/nodes.util';
import mergeCallback from '../callbacks/merge.callback';


/**
 * Storage of static permissions.
 */
export class StaticPermissionsStorage {
    private permissions: StaticPermission[] = [];

    /**
     * Add a list of static permissions.
     * 
     * Note that permissions are passed through the merge process.
     * @param permissions - static permissions list.
     */
    addPermissions(permissions: StaticPermission[]) {
        this.permissions = nodesUtil.mergeNodes(
            mergeCallback.forStatics,
            ...this.permissions, ...permissions
        );
    }

    /**
     * Check if a base permission is stored, by key.
     * @param key - base permission's key.
     * @returns `true` if the permission is stored.
     */
    hasPermissionByKey(key: string): boolean {
        for(let perm of this.permissions) {
            if(perm.key === key) return true;
        }
        return false;
    }

    /**
     * Check if a nested permission is stored, by a dot-notation path.
     * @param path - dot-notation path to the nested permission.
     * @returns `true` if the nested permission is found.
     */
    hasNestedPermission(path: string): boolean {
        let arrPath = path.split('.');
        if(arrPath.length <= 0) throw new Error(`Path should contain at least 1 fragment.`);
        return nodesUtil.includesNestedNode(arrPath, this.permissions);
    }

    /**
     * Get a base permission by key.
     * @param key - permission's key.
     * @returns `StaticPermission` OR `null` if not found.
     */
    getPermissionByKey(key: string): StaticPermission | null {
        for(let perm of this.permissions) {
            if(perm.key === key) return perm;
        }
        return null;
    }

    /**
     * Get a nested permission or return a minimal valid path.
     * @param path - dot-notation path to the permission.
     * @returns permission or a minimal valid path.
     */
    getNestedPermissionOrValidPath(path: string): StaticPermission | string {
        let arrPath = path.split('.');
        if(arrPath.length <= 0) throw new Error(`Path should contain at least 1 fragment.`);
        return nodesUtil.findNestedNodeOrValidPath(arrPath, this.permissions);
    }

    /**
     * Get a nested permission.
     * @param path - dot-notation path to the permission.
     * @returns permission or `null` if not found.
     */
    getNestedPermission(path: string): StaticPermission | null {
        return nodesUtil.findNestedNode(path.split('.'), this.permissions);
    }

    /**
     * Get a list of stored permissions.
     * @returns the storage's permissions array.
     */
    getPermissions(): StaticPermission[] {
        return this.permissions;
    }

    /**
     * Count stored base permissions.
     * @returns base permissions amount.
     */
    countPermissions(): number {
        return this.permissions.length;
    }
}
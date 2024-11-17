import mergeCallback from '../callbacks/merge.callback';
import { Group } from '../interfaces/group.interface';
import groupsUtil from '../utils/groups.util';
import nodesUtil from '../utils/nodes.util';


/**
 * Factory class for the Group type.
 */
export class GroupFactory {
    private group: Group;

    constructor(name: string) {
        this.group = {
            name,
            permissions: [],
            childGroups: [],
        };
    }


    /**
     * Add the group of the factory to child groups list of a parent group.
     * @param parentGroup - parent group.
     * @returns factory chain.
     */
    addParentGroup(parentGroup: Group): GroupFactory {
        if(!parentGroup.childGroups.includes(this.group.name)) {
            parentGroup.childGroups.push(this.group.name);
        }
        return this;
    }

    /**
     * Add the group of the factory to child groups of a groups array.
     * @param parentGroups - parent groups array.
     * @returns factory chain.
     */
    addParentGroups(parentGroups: Group[]): GroupFactory {
        for(let group of parentGroups) {
            this.addParentGroup(group);
        }
        return this;
    }

    /**
     * Add a permission from a dot-noted string.
     * @param perm - dot-noted path of a permission.
     * @param positive - positive property of the last permission on the path.
     * @param wildcard - wildcard property of the last permission on the path.
     * @returns factory chain.
     */
    addPermission(perm: string, positive: boolean | null = true, wildcard: boolean | null = null): GroupFactory {
        let basePermission = groupsUtil.permissionFromPath(perm.split('.'), positive, wildcard);
        this.group.permissions = nodesUtil.mergeNodes(mergeCallback.forGroups, ...this.group.permissions, basePermission);
        return this;
    }

    /**
     * Add a list of dot-noted permissions, with 'positive: true', 'wildcard: null'
     * influences for the last node. If you need to set influence use addPermission().
     * @param perms list of dot-noted permissions.
     * @returns factory chain.
     */
    addPermissions(perms: string[]): GroupFactory {
        for(let perm of perms) {
            this.addPermission(perm, true, null);
        }
        return this;
    }

    /**
     * Create an instance of a group according to the specified parameters.
     * @returns a group.
     */
    build(): Group {
        return structuredClone(this.group);
    }
}
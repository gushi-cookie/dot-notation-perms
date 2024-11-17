import { Group } from '../interfaces/group.interface';
import groupsUtil from '../utils/groups.util';


/**
 * Storage of Group types.
 */
export class GroupsStorage {
    private groups: Group[] = [];


    /**
     * Check if a group by a name is stored.
     * @param name - name of the group.
     * @returns `true` if the group is stored.
     */
    hasGroup(name: string): boolean {
        for(let group of this.groups) {
            if(group.name === name) return true;
        }
        return false;
    }

    /**
     * Add a list of groups to the storage.
     * 
     * Note that new groups are passed through the merge process.
     * @param groups - groups to add.
     */
    addGroups(groups: Group[]) {
        this.groups = groupsUtil.mergeGroups(...this.groups, ...groups);
    }

    /**
     * Get group by name.
     * @param name - name of the group.
     * @returns `Group` or `null` if not found.
     */
    getGroup(name: string): Group | null {
        for(let group of this.groups) {
            if(group.name === name) return group;
        }
        return null;
    }

    /**
     * Get a list of stored groups.
     * @returns the storage's groups array.
     */
    getGroups(): Group[] {
        return this.groups;
    }

    /**
     * Count stored groups.
     * @returns groups amount.
     */
    countGroups(): number {
        return this.groups.length;
    }

    /**
     * Get parent groups of a group.
     * @param childGroup - child group.
     * @returns list of child groups.
     */
    getParentGroups(childGroup: Group): Group[] {
        let result: Group[] = [];

        for(let group of this.groups) {
            if(group.childGroups.includes(childGroup.name)) result.push(group);
        }

        return result;
    }
}
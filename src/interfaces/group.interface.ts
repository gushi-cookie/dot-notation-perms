import { GroupPermission } from './permissions.interface';


/**
 * Represents a named group of permissions and child groups of the current group.
 */
export interface Group {
    /** Group name. */
    name: string;

    /** Group permissions. */
    permissions: GroupPermission[];

    /** Names of child groups. */
    childGroups: string[];
}
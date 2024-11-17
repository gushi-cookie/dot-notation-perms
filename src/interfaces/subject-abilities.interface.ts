import { SubjectPermission } from './permissions.interface';


/**
 * Describes groups and permissions of a subject.
 */
export interface SubjectAbilities {
    /** Group names the subject belongs to. */
    groups: string[],

    /** Subject's permissions. */
    permissions: SubjectPermission[];
}
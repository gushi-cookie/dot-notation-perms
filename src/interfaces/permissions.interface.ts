import { Node, NodeInfluence, NodeArguments } from './nodes.interface';


/**
 * Permission node of a static permission.
 */
export interface StaticPermission extends Node {
    /** Child permissions. */
    nodes: StaticPermission[];

    /** Required parameters */
    requiredParams: string[];

    /** Optional parameters */
    optionalParams: string[];
}

/**
 * Permission node of a group permission.
 */
export interface GroupPermission extends Node, NodeInfluence, NodeArguments {
    /** Child permissions. */
    nodes: GroupPermission[];
}

/**
 * Permission node of a subject permission.
 */
export interface SubjectPermission extends Node, NodeInfluence, NodeArguments {
    /** Child permissions */
    nodes: SubjectPermission[];
}
/**
 * Basic data of a permission node.
 */
export interface Node {
    /** Node key. */
    key: string;

    /** Child nodes. */
    nodes: Node[];
}



/**
 * Overriding data of an influence node.
 */
export interface InfluenceOverriding {
    /**
     * Boolean values mean positiveness of a permission.
     * 
     * Null value means that the current permission is inactive (doesn't have any effect).
     */
    positive?: boolean | null;

    /** 
     * Boolean values mean positiveness of the wildcard for a permission.
     * 
     * Null value means that the wildcard is inactive (doesn't have any effect).
     */
    wildcard?: boolean | null;
}

/**
 * Represents data of a node that has influence on a nodes tree.
 */
export interface NodeInfluence {
    /**
     * Boolean values mean positiveness of a permission.
     * 
     * Null value means that the current permission is inactive (doesn't have any effect).
     */
    positive: boolean | null;

    /** 
     * Boolean values mean positiveness of the wildcard for a permission.
     * 
     * Null value means that the wildcard is inactive (doesn't have any effect).
     */
    wildcard: boolean | null;

    /**
     * Overriding list of a node's influence.
     */
    influenceOverridingList: InfluenceOverriding[];
}



/**
 * A single argument of a node.
 */
export interface Argument {
    positive: boolean;
    value: object;
}

/**
 * Represents arguments of a node.
 */
export interface NodeArguments {
    /** Arguments of a node. */
    arguments: Argument[];
}
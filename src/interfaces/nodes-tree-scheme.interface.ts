/**
 * Basic type for describing node schemes.
 * 
 * Should be implemented by another interface.
 */
export interface NodesTreeScheme {
    /** Path on a nodes tree of a current scheme object. */
    _path: string;

    /** Individual scheme's properties */
    [key: string]: NodesTreeScheme | string;
}
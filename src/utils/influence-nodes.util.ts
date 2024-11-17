import nodesUtil from './nodes.util';
import { InfluenceOverriding, Node, NodeInfluence } from '../interfaces/nodes.interface';


/**
 * Find a nested node, in a nodes array, that has influence on a specified path.
 * Search process starts from the end of the nodes array.
 * @param path - keys path to the searched node.
 * @param nodes - base nodes list where to search.
 * @returns `node` or `null` if not found.
 */
function findActiveNode<T extends Node & NodeInfluence>(path: string[], nodes: T[]): T | null {
    let baseNode = nodesUtil.findNodeByKey(path[0], nodes);
    if(!baseNode) return null;

    path = path.slice(1);
    if(path.length <= 0) {
        if(typeof baseNode.wildcard !== 'boolean' || typeof baseNode.positive !== 'boolean') {
            return null;
        } else {
            return baseNode;
        }
    }


    let node: T | null = baseNode;
    for(let key of path) {
        node = nodesUtil.findNodeByKey(key, node.nodes.reverse()) as T;

        if(!node) {
            return null;
        } else if(typeof node.wildcard === 'boolean' || typeof node.positive === 'boolean') {
            return node;
        } else {
            return null;
        }
    }

    return node;
}

/**
 * Find active positiveness (positive property value) of a node.
 * The search is started from the end of influence overriding list.
 * If nothing found, then the node's positiveness is returned.
 * @param node - target node.
 * @return active positiveness of the node.
 */
function findActivePositiveness<T extends Node & NodeInfluence>(node: T): boolean | null {
    for(let override of node.influenceOverridingList.reverse()) {
        if(override.positive !== undefined) return override.positive;
    }
    return node.positive;
}

/**
 * Find active wildcard of a node. The search is started from
 * the end of influence overriding list. If nothing found, then
 * the node's wildcard is returned.
 * @param node - target node.
 * @return active wildcard of the node.
 */
function findActiveWildcard<T extends Node & NodeInfluence>(node: T): boolean | null {
    for(let override of node.influenceOverridingList.reverse()) {
        if(override.wildcard !== undefined) return override.wildcard;
    }
    return node.wildcard;
}


/**
 * Check if a target node has a different influence to a main node.
 * If so, then an InfluenceOverriding object being formed.
 * 
 * Influence overriding list of the target node is ignored.
 * @param mainNode - the main node.
 * @param targetNode - the target node.
 * @returns `InfluenceOverriding` or `null` if the main's node active influence equals to the target node.
 */
function getNodeOverriding<T extends Node & NodeInfluence>(mainNode: T, targetNode: T): InfluenceOverriding | null {
    let result: InfluenceOverriding = {};
    let resultChanged = false;

    if(findActivePositiveness(mainNode) !== targetNode.positive) {
        resultChanged = true;
        result.positive = targetNode.positive;
    }

    if(findActiveWildcard(mainNode) !== targetNode.wildcard) {
        resultChanged = true;
        result.wildcard = targetNode.wildcard;
    }

    return resultChanged ? result : null;
}

/**
 * Get a positiveness sign.
 * @param positive - positiveness state.
 * @returns positiveness sign.
 */
function getPositivenessSign(positive: boolean): string {
    return positive ? ' ' : '-';
}

// TO-DO vvvvv
// function formAvailablePaths<T extends PermissionNode & PermissionEffect>(formVariants: FormNodeVariantsCallback<T>, permission: T): string[] {
//     return _formAvailablePaths('', formVariants, permission);
// }
// function _formAvailablePaths<T extends PermissionNode & PermissionEffect>(prefix: string, formVariants: FormNodeVariantsCallback<T>, permission: T): string[] {
//     let result: string[] = [];
//     prefix = prefix.length === 0 ? permission.key : `${prefix}.${permission.key}`;
// 
//     if(permission.positive !== null) {
//         let sign = positivenessSign(permission.positive);
//         result.push(`${sign}${prefix}`);
// 
//         for(let variant of formVariants(permission)) {
//             result.push(`${sign}${prefix}.${variant}`);
//         }
//     }
// 
//     if(permission.wildcard !== null) {
//         let sign = positivenessSign(permission.wildcard);
//         result.push(`${sign}${prefix}.*`);
//     }
// 
//     for(let nested of permission.permissions) {
//         result.push(..._formAvailablePaths(prefix, formVariants, nested as T));
//     }
// 
//     return result;
// }


export default {
    findActiveNode,
    findActivePositiveness,
    findActiveWildcard,

    getNodeOverriding,
    getPositivenessSign,
};
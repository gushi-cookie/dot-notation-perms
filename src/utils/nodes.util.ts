import { arrays } from '../common/utils/collection.util';
import { Node } from '../interfaces/nodes.interface';


/**
 * Merge data of two nodes of the \<T> type. Properties (key, nodes) shouldn't be merged.
 */
export interface MergeNodesCallback<T extends Node> {
    (first: T, second: T): T;
}

/**
 * Form node variants of the \<T> type.
 * The node's key should be included in a prefix.
 */
export interface FormNodeVariantsCallback<T extends Node> {
    (prefix: string, node: T): string[];
}


/**
 * Merge a list of nodes. Base nodes are grouped into lists by keys,
 * according to the passed order. Then nodes of each list are merged
 * together, starting from the first (left) node of a list.
 * 
 * Merge conflicts are resolved by a specified mergeCallback function.
 * @param mergeCallback - merge callback for the \<T> type.
 * @param nodes - list of nodes to merge.
 * @returns array of new merged nodes.
 */
function mergeNodes<T extends Node>(mergeCallback: MergeNodesCallback<T>, ...nodes: T[]): T[] {
    let result: T[] = [];
    let duplicatesSearchResult = arrays.findDuplicatesByPredicate(nodes, (node1, node2) => node1.key === node2.key);

    for(let duplicates of duplicatesSearchResult.duplicates) {
        result.push(arrays.mergeItems(duplicates, (lastMerged: T, toMerge: T) => {
            return mergeTwoNodes(lastMerged, toMerge, mergeCallback);
        }));
    }

    result.push(...duplicatesSearchResult.unique);
    return result;
}

/**
 * Merge two nodes.
 * 
 * Merge conflicts are resolved by a specified mergeCallback function.
 * @param first - first node.
 * @param second - second node.
 * @param mergeNodes - merge callback for the \<T> type.
 * @returns a new merged node.
 */
function mergeTwoNodes<T extends Node>(first: T, second: T, mergeCallback: MergeNodesCallback<T>): T {
    let baseNode = mergeCallback(first, second);
    baseNode.key = second.key;
    baseNode.nodes = mergeNodes(mergeCallback, ...first.nodes as T[], ...second.nodes as T[]);
    return baseNode;
}


/**
 * Check if a nodes array contains a node by a key.
 * @param key - key of the searched node.
 * @param nodes - nodes list.
 * @returns `true` if the node found.
 */
function includesNodeByKey<T extends Node>(key: string, nodes: T[]): boolean {
    for(let perm of nodes) {
        if(perm.key === key) return true;
    }
    return false;
}

/**
 * Check if a nodes array contains a nested node.
 * @param path - keys path to the nested node.
 * @param nodes - nodes array.
 * @returns `true` if the node exists on the path.
 */
function includesNestedNode<T extends Node>(path: string[], nodes: T[]): boolean {
    return findNestedNode(path, nodes) !== null;
}


/**
 * Find a node in a nodes array by a key.
 * @param key - key of the node.
 * @param nodes - nodes array.
 * @returns `node` OR `null` if not found.
 */
function findNodeByKey<T extends Node>(key: string, nodes: T[]): T | null {
    for(let node of nodes) {
        if(node.key === key) return node;
    }
    return null;
}

/**
 * Find a nested node by a path or return a minimal valid path.
 * @param path - path to the nested node.
 * @param nodes - nodes array.
 * @returns `node` OR minimal valid path.
 */
function findNestedNodeOrValidPath<T extends Node>(path: string[], nodes: T[]): T | string {
    let baseNode = findNodeByKey(path[0], nodes);
    if(!baseNode) return '';

    if(path.length < 2) return baseNode;
    let validPath = [path[0]];
    path.slice(1);


    let node: T | null = baseNode;
    for(let key of path) {
        node = findNodeByKey(key, node.nodes as (T[]));
        if(!node) return validPath.join('.');
        validPath.push(key);
    }

    return node ? node : validPath.join('.');
}

/**
 * Find a nested node by a path.
 * @param path - path to the nested node.
 * @param nodes - nodes array.
 * @returns `node` OR `null` if not found.
 */
function findNestedNode<T extends Node>(path: string[], nodes: T[]): T | null {
    let result = findNestedNodeOrValidPath(path, nodes);
    return typeof result === 'string' ? null : result;
}


/**
 * Sort every passed and nested nodes, by key.
 * 
 * Note that the function mutates passed objects. Use
 * structuredClone() function to clone your nodes.
 * @param nodes - list of nodes to sort.
 */
function sortNodes<T extends Node>(...nodes: T[]) {
    nodes = nodes.sort((node1, node2) => node1.key.localeCompare(node2.key));

    for(let node of nodes) {
        sortNode(node);
    }
}

/**
 * Sort nested nodes of a passed node, by key.
 * 
 * Note that the function mutates passed objects. Use
 * structuredClone() function to clone your nodes.
 * @param node - node to sort.
 */
function sortNode<T extends Node>(node: T) {
    node.nodes.sort((a, b) => a.key.localeCompare(b.key));

    for(let childNode of node.nodes) {
        sortNode(childNode);
    }
}


/**
 * Form all available paths, including nested, of a \<T> type node.
 * @param formVariants - \<T> type specific function for forming variants of the node.
 * @param node - target node.
 * @returns a list of available paths.
 */
function formAvailablePaths<T extends Node>(formVariants: FormNodeVariantsCallback<T>, node: T): string[] {
    return _formAvailablePaths('', formVariants, node);
}

/**
 * Recursive function for the formAvailablePaths().
 * @param prefix - prefix of the node.
 * @param formVariants - \<T> type specific function for forming variants of the node.
 * @param node - target node.
 * @returns a list of available paths.
 */
function _formAvailablePaths<T extends Node>(prefix: string, formVariants: FormNodeVariantsCallback<T>, node: T): string[] {
    let result: string[] = [];
    prefix = prefix.length === 0 ? node.key : `${prefix}.${node.key}`;
    result.push(...formVariants(prefix, node));

    for(let nested of node.nodes) {
        result.push(..._formAvailablePaths(prefix, formVariants, nested as T));
    }

    return result;
}


export default {
    mergeNodes,
    mergeTwoNodes,

    includesNodeByKey,
    includesNestedNode,

    findNodeByKey,
    findNestedNodeOrValidPath,
    findNestedNode,

    sortNodes,
    sortNode,

    formAvailablePaths,
};
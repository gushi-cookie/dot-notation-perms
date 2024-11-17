import { Group } from '../interfaces/group.interface';
import nodesUtil from './nodes.util';
import { GroupPermission } from '../interfaces/permissions.interface';
import { arrays } from '../common/utils/collection.util';
import mergeCallback from '../callbacks/merge.callback';


/**
 * Merge a list of groups. Group names are used to separate groups into lists,
 * according to the passed order. Then groups in each list get merged together,
 * starting from the first (left) group.
 * 
 * Merge conflicts are resolved by the forGroups() merge callback function.
 * @param groups - groups to merge.
 * @returns array of new merged groups.
 */
function mergeGroups(...groups: Group[]): Group[] {
    let result: Group[] = [];
    let duplicatesSearchResult = arrays.findDuplicatesByPredicate(groups, (group1, group2) => group1.name === group2.name);

    for(let duplicates of duplicatesSearchResult.duplicates) {
        result.push(arrays.mergeItems(duplicates, (lastMerged, toMerge) => {
            return mergeTwoGroups(lastMerged, toMerge);
        }));
    }

    result.push(...duplicatesSearchResult.unique);
    return result;
}

/**
 * Merge two groups. Merge conflicts are resolved by the forGroups() merge
 * callback function.
 * @param group1 - the first group.
 * @param group2 - the second group.
 * @returns a new merged group.
 */
function mergeTwoGroups(group1: Group, group2: Group): Group {
    return {
        name: group2.name,
        childGroups: [...new Set([...group1.childGroups, ...group2.childGroups])],
        permissions: nodesUtil.mergeNodes(
            mergeCallback.forGroups, ...group1.permissions, ...group2.permissions
        ),
    };

    // let permissions: GroupPermission[] = [];
    // TO-DO delete

    // let perm2;
    // for(let perm1 of group1.permissions) {
    //     perm2 = nodesUtil.findPermissionByKey(perm1.key, group2.permissions);

    //     if(perm2) {
    //         permissions.push(nodesUtil.mergePermissions(perm1, perm2, mergeCallbacksUtil.mergeGroupPermissions));
    //     } else {
    //         permissions.push(perm1);
    //     }
    // }

    // let perm1;
    // for(let perm2 of group2.permissions) {
    //     perm1 = nodesUtil.findPermissionByKey(perm2.key, group2.permissions);

    //     if(perm1 && !nodesUtil.includesPermissionByKey(perm2.key, permissions)) {
    //         permissions.push(nodesUtil.mergePermissions(perm1, perm2, mergeCallbacksUtil.mergeGroupPermissions));
    //     } else {
    //         permissions.push(perm2);
    //     }
    // }


    // let childGroups = group1.childGroups.concat(group2.childGroups);
    // childGroups = [...new Set(childGroups)];

    // return { 
    //     name: group2.name,
    //     permissions,
    //     childGroups,
    // };
}


/**
 * Create a single permission tree from a path.
 * @param path - list of the tree keys.
 * @param positive - positive property of the last node.
 * @param wildcard - wildcard property of the last node.
 * @returns base permission of the new tree.
 */
function permissionFromPath(path: string[], positive: boolean | null, wildcard: boolean | null): GroupPermission {
    let basePermission: GroupPermission = { 
        key: path[0],
        nodes: [],
        positive: null,
        wildcard: null,
        influenceOverridingList: [],
        arguments: [],
    };
    path = path.slice(1);
    if(path.length === 0) return basePermission;

    let prevPermission = basePermission;
    let nextPermission: GroupPermission;
    for(let key of path) {
        nextPermission = {
            key,
            nodes: [],
            positive: null,
            wildcard: null,
            influenceOverridingList: [],
            arguments: [],
        };
        prevPermission.nodes.push(nextPermission);
        prevPermission = nextPermission;
    }

    prevPermission.positive = positive;
    prevPermission.wildcard = wildcard;

    return basePermission;
}


export default {
    mergeGroups,
    mergeTwoGroups,

    permissionFromPath,
};
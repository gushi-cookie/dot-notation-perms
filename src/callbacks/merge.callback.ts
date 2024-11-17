import { GroupPermission, StaticPermission, SubjectPermission } from '../interfaces/permissions.interface';
import { MergeNodesCallback } from '../utils/nodes.util';
import influenceNodesUtil from '../utils/influence-nodes.util';


const forGroups: MergeNodesCallback<GroupPermission> = function(first, second): GroupPermission {
    let newNode = structuredClone(first);

    let influenceOverride = influenceNodesUtil.getNodeOverriding(first, second);
    if(influenceOverride) newNode.influenceOverridingList.push(influenceOverride);

    newNode.arguments.push(...second.arguments);

    return newNode;
};

const forStatics: MergeNodesCallback<StaticPermission> = function(first, second): StaticPermission {
    first;
    return {
        key: '', nodes: [],
        requiredParams: second.requiredParams,
        optionalParams: second.optionalParams,
    };
};

const forSubject: MergeNodesCallback<SubjectPermission> = function(first, second) {
    let newNode = structuredClone(first);

    let influenceOverride = influenceNodesUtil.getNodeOverriding(first, second);
    if(influenceOverride) newNode.influenceOverridingList.push(influenceOverride);

    newNode.arguments.push(...second.arguments);

    return newNode;
};


export default {
    forGroups,
    forStatics,
    forSubject,
};
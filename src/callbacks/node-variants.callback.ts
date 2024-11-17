import { GroupPermission, StaticPermission, SubjectPermission } from '../interfaces/permissions.interface';
import { FormNodeVariantsCallback } from '../utils/nodes.util';
import influenceNodesUtil from '../utils/influence-nodes.util';
import { Node, NodeArguments, NodeInfluence } from '../interfaces/nodes.interface';


const variantsForGroupAndSubjectPermissions = function<T extends Node & NodeInfluence & NodeArguments>(prefix: string, permission: T): string[] {
    let result: string[] = [];


    let sign;
    let args;
    for(let argument of permission.arguments) {
        sign = influenceNodesUtil.getPositivenessSign(argument.positive);
        args = Object.values(argument.value).join('.');
        result.push(`${sign}${prefix}.${args}`);
    }


    if(permission.positive !== null) {
        sign = influenceNodesUtil.getPositivenessSign(permission.positive);
        result.push(`${sign}${prefix}`);
    }
    if(permission.wildcard !== null) {
        sign = influenceNodesUtil.getPositivenessSign(permission.wildcard);
        result.push(`${sign}${prefix}.*`);
    }


    for(let override of permission.influenceOverridingList) {
        if(override.positive !== undefined) {
            if(override.positive === null) {
                result.push(`!${prefix}`);
            } else {
                sign = influenceNodesUtil.getPositivenessSign(override.positive);
                result.push(`${sign}${prefix}`);
            }
        }

        if(override.wildcard !== undefined) {
            if(override.wildcard === null) {
                result.push(`!${prefix}.*`);
            } else {
                sign = influenceNodesUtil.getPositivenessSign(override.wildcard);
                result.push(`${sign}${prefix}.*`);
            }
        }
    }


    return result;
};

const forGroup: FormNodeVariantsCallback<GroupPermission> = variantsForGroupAndSubjectPermissions;
const forSubject: FormNodeVariantsCallback<SubjectPermission> = variantsForGroupAndSubjectPermissions;


const forStatic: FormNodeVariantsCallback<StaticPermission> = function(prefix: string, permission: StaticPermission) {
    let params = [
        ...permission.requiredParams.map((name) => `<${name}>`),
        ...permission.optionalParams.map((name) => `[${name}]`),
    ].join('.');

    return params.length === 0 ? [prefix] : [`${prefix}.${params}`];
};


export default {
    forGroup,
    forStatic,
    forSubject,
};
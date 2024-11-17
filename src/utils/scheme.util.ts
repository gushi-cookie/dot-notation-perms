import { modules } from '../esm-modules';
import { NodesTreeScheme } from '../interfaces/nodes-tree-scheme.interface';
const { kebabCase } = modules.changeCase;


/**
 * Mutate values of a scheme object by associating them with the scheme's
 * properties and depth.
 * @param basePrefix - base/root prefix.
 * @param scheme - scheme object to assemble.
 */
export function assembleScheme(basePrefix: string, scheme: NodesTreeScheme) {
    basePrefix = basePrefix.includes('.') ? basePrefix : kebabCase(basePrefix);;
    scheme._path = basePrefix;


    let prefix;
    let value;
    for(let property of Object.getOwnPropertyNames(scheme)) {
        if(property === '_path') continue;
        prefix = `${basePrefix}.${kebabCase(property)}`;
        value = scheme[property];

        if(typeof value === 'string') {
            scheme[property] = prefix;
        } else if(typeof value === 'object') {
            value._path = prefix;
            assembleScheme(prefix, value);
        } else {
            throw new Error(`Type '${typeof value}' of '${property}' property not supported.`);
        }
    }
}
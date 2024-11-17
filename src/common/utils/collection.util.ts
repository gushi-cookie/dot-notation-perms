export namespace arrays {
    /**
     * Find duplicated elements of array, using Array.prototype.includes method.
     * @param array - array where to search.
     * @returns array of unique items that were met multiple times.
     */
    export function findDuplicates<T>(array: T[]): T[] {
        let duplicates: T[] = [];

        let metElements: T[] = [];
        for(let el of array) {
            if(metElements.includes(el)) {
                if(!duplicates.includes(el)) duplicates.push(el);
            } else {
                metElements.push(el);
            }
        }

        return duplicates;
    }

    /**
     * Check if some sub-array includes a specific item.
     * @param item - item to search.
     * @param array - array of sub-arrays.
     * @returns true if the item is included in some sub-array.
     */
    export function includedInSubArrays<T>(item: T, array: T[][]): boolean {
        for(let sub of array) {
            if(sub.includes(item)) return true;
        }
        return false;
    }

    /**
     * Find sub array that includes a specific item.
     * @param item - item to search.
     * @param array - array of sub-arrays.
     * @returns sub-array or null if not found.
     */
    export function findSubArrayThatIncludes<T>(item: T, array: T[][]): T[] | null {
        for(let sub of array) {
            if(sub.includes(item)) return sub;
        }
        return null;
    }

    /**
     * Merge an array of T type items, using a specified merge callback function.
     * @param array - items to merge.
     * @param mergeCallback - function for merging T type.
     * @param fromLeft - should merge process start iterating elements from the end of the array.
     * @returns merge result.
     */
    export function mergeItems<T>(array: T[], mergeCallback: (lastMerged: T, toMerge: T) => T): T {
        let lastMerged = array.splice(0, 1)[0];
        for(let item of array) {
            lastMerged = mergeCallback(lastMerged, item);
        }

        return lastMerged;
    }


    // ##########################
    // #  Predicate Duplicates  #
    // ##########################
    /**
     * @param a - first element to compare.
     * @param b - second element to compare.
     * @returns true if elements are alike.
     */
    export interface DuplicatesPredicate<T> {
        (a: T, b: T): boolean;
    }

    export interface DuplicatesSearchResult<T> {
        /** Array that holds sub-arrays of duplicated items. */
        duplicates: T[][];

        /** Unique items array. */
        unique: Array<T>;
    }

    /**
     * Find duplicated elements using a predicate function.
     * @param array - array of items where to search for duplicated values.
     * @param predicate - comparing function for array items.
     * @returns duplicates sub-arrays and unique items.
     */
    export function findDuplicatesByPredicate<T>(array: T[], predicate: DuplicatesPredicate<T>): DuplicatesSearchResult<T> {
        let result: DuplicatesSearchResult<T> = { duplicates: [], unique: [] };


        let duplicates;
        let item1: T;
        let item2: T;
        for(let i = 0; i < array.length; i++) {
            item1 = array[i];
            for(let j = 0; j < array.length; j++) {
                item2 = array[j];
                if(i === j || !predicate(item1, item2)) continue;
                
                duplicates = findSubArrayThatIncludes(item1, result.duplicates);
                if(!duplicates) duplicates = findSubArrayThatIncludes(item2, result.duplicates);

                if(!duplicates) {
                    result.duplicates.push([item1, item2]);
                    continue;
                }

                if(duplicates.includes(item1) && !duplicates.includes(item2)) {
                    duplicates.push(item2);
                } else if(duplicates.includes(item2) && ! duplicates.includes(item1)) {
                    duplicates.push(item1);
                } else {
                    continue;
                }
            }
        }


        for(let item of array) {
            if(!includedInSubArrays(item, result.duplicates)) {
                result.unique.push(item);
            }
        }
        
        return result;
    }
}
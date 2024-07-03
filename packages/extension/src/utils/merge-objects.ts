import type { TODAY, SETTINGS } from './types.d'

type MergeableObject = TODAY | SETTINGS

export function mergeObjects(base: MergeableObject, other: Partial<MergeableObject>): MergeableObject {
    for (const key in other) {
        if (base.hasOwnProperty(key) && other[key] !== undefined) {
            base[key] = other[key]
        }
    }
    return base
}

import { createHash } from 'node:crypto'

export function md5(key: string): string {  
    return createHash('md5').update(key).digest('hex')
}

export function hexToInt(hash: string): number {
    return parseInt(hash, 16)
}

export function fileSelect(hash: number): number {
    return hash % 10
}
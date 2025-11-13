export function makeEven(str: string): string {
    return (str.length % 2 == 1) ? `0${str}` : str
}
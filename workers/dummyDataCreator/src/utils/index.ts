export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max)
}

export const arrayRegex = /(Array<(?<name>.+)>)|(?<name2>\w+)\[\]|\[\]/

export const recordRegex = /Record<(.+),(.+)>/

export const specialRegex = /\$.+/

export const paramRegex = /@\d_(.+)/

export const REGEX = {
    array: arrayRegex,
    record: recordRegex,
    special: specialRegex,
    parameter: paramRegex,
    SPECIAL_CHARACTER_PARSER: /[^\w\d\n]/,
    PROPERTY_NAME: /(\w+)<(.+)>/,
    GENERATE_PROPERTY_REGEX: ({
        index,
        name,
    }: {
        index?: number
        name?: string
    }) => {
        return new RegExp(
            `@${index == undefined ? `\\d` : index}_(${name || `.+`})`
        )
    },
}

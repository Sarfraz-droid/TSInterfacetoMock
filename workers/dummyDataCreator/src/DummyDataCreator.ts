import { faker } from '@faker-js/faker'
import { TypeKind, IType } from './types/index'
import {
    REGEX,
    arrayRegex,
    getRandomInt,
    recordRegex,
    specialRegex,
} from './utils/index'
import _ from 'lodash'

export class DummyDataCreator {
    map: any = {}
    types: IType = {}

    constructor(map: any, types: IType) {
        this.map = map
        this.types = types
    }

    getDummy(type: string, parameters?: any): any {
        // log.info(
        //     `[getDummy] type: ${type} | parameters: ${JSON.stringify(
        //         parameters,
        //         null,
        //         2
        //     )}`
        // )
        if (parameters && parameters[type]) {
            return this.getDummy(parameters[type])
        }

        switch (true) {
            case type == 'string':
                return faker.lorem.word()
            case type == 'number':
                return faker.datatype.number()
            case type == 'boolean':
                return faker.datatype.boolean()
            case type == 'any':
                return faker.lorem.word()
            case type == 'null':
                return null
            case arrayRegex.test(type):
                const match = type.match(arrayRegex)
                if (match.groups.name2 || match.groups.name) {
                    return [
                        this.getDummy(
                            (match.groups.name2 || match.groups.name).trim()
                        ),
                    ]
                }
                return []
            case recordRegex.test(type):
                const match1 = type.match(recordRegex)

                if (match1) {
                    const key = this.getDummy(match1[1].trim())

                    return {
                        [key]: this.getDummy(match1[2].trim()),
                    }
                }
                break
            default:
        }

        switch (true) {
            case typeof type == 'string' && this.types[type] != undefined:
                return this.createDummyData(type)
            case typeof type == 'object':
                return this.interfaceDataGenerator(type)
            default:
        }

        return type
    }

    createDummyData(IName: string) {
        const name = this.getTypeName(IName)

        const data = this.map[name]

        switch (this.types[name]) {
            case TypeKind.Interface:
                return this.interfaceDataGenerator(data, IName)
            case TypeKind.Enum:
                return this.enumDataGenerator(data)
            default:
        }
    }

    getTypeName(name: string) {
        const match = name.match(REGEX.PROPERTY_NAME)

        if (match) {
            return match[1]
        }

        return name
    }

    getParamtersFromINAME(name: string) {
        const match = name.match(REGEX.PROPERTY_NAME)

        if (match) {
            const str = match[2].split(',').map((item) => item.trim())

            return str
        }

        return []
    }

    interfaceDataGenerator(data: any, name?: string) {
        if (!data) {
            throw new Error(`No interface found for ${JSON.stringify(data)}`)
        }

        let keys = Object.keys(data)

        let dummyData: {
            [key: string]: any
        } = {}

        const parameterMaps = this.getParamtersFromINAME(name || '')

        const paramters: any = {}

        const paramKeys = keys.filter((key) =>
            REGEX.GENERATE_PROPERTY_REGEX({}).test(key)
        )

        parameterMaps.forEach((param, index) => {
            const regex = REGEX.GENERATE_PROPERTY_REGEX({ index })

            paramKeys.forEach((key) => {
                const match = key.match(regex)
                if (match) {
                    paramters[match[1]] = param
                }
            })
        })

        paramKeys.forEach((key) => {
            const match = key.match(REGEX.GENERATE_PROPERTY_REGEX({}))
            if (match && !paramters[match[1]]) {
                paramters[match[1]] = data[key]
            }
        })

        keys = keys.filter(
            (key) => !REGEX.GENERATE_PROPERTY_REGEX({}).test(key)
        )

        keys.forEach((key) => {
            let value: any = null
            switch (true) {
                case Array.isArray(data[key]):
                    value = data[key][getRandomInt(data[key].length)]
                    dummyData[key] = this.getDummy(value, paramters)
                    break
                case specialRegex.test(key):
                    value = this.createDummyData(data[key])
                    dummyData = _.merge(dummyData, value)
                    break
                default:
                    value = data[key]
                    dummyData[key] = this.getDummy(value, paramters)
            }

            console.log(key, value)
        })

        return dummyData
    }

    enumDataGenerator(data: any) {
        const keys = Object.keys(data)

        const res = data[keys[getRandomInt(keys.length)]]

        return res
    }
}

import ts from 'typescript'
import _ from 'lodash'
import { IType, TypeKind } from './types/index'
import { REGEX } from './utils'

export class DataGraphGenerator {
    map: any = {}
    types: IType = {}

    constructor() {}

    build(fileStr: string) {
        const sourcefile = ts.createSourceFile(
            './src/example.ts',
            fileStr,
            ts.ScriptTarget.ES2015,
            true,
            ts.ScriptKind.TS
        )

        sourcefile.forEachChild((node: ts.Node) => {
            if (node.kind == ts.SyntaxKind.InterfaceDeclaration) {
                this.buildInterface(node, '')
            } else if (node.kind == ts.SyntaxKind.EnumDeclaration) {
                this.buildEnum(node, '')
            } else {
                // console.log(node.kind, node.getText())
            }
        })

        // console.log(this.map)
    }

    buildInterface(node: ts.Node, path: string): any {
        let keyword: string = path
        let properties: any = {}
        const parameters: number = 0
        node.getChildren().forEach((child: ts.Node) => {
            switch (child.kind) {
                case ts.SyntaxKind.Identifier:
                    const str = child.getText()
                    keyword = str
                    this.types[str] = TypeKind.Interface
                    break
                case ts.SyntaxKind.SyntaxList:
                    properties = _.merge(
                        properties,
                        this.buildProperties(child, keyword, parameters)
                    )
                    break
                default:
                    console.log(child.kind, child.getText())
            }
        })

        this.map = _.merge(this.map, properties)
    }

    buildEnum(node: ts.Node, _path: string): any {
        this.types[node.getText()] = TypeKind.Enum
        let keyword: string = ''
        let properties: any = {}
        node.getChildren().forEach((child: ts.Node) => {
            switch (child.kind) {
                case ts.SyntaxKind.Identifier:
                    const str = child.getText()
                    keyword = str
                    this.types[str] = TypeKind.Enum
                    break
                case ts.SyntaxKind.SyntaxList:
                    child.getChildren().forEach((child: ts.Node) => {
                        switch (child.kind) {
                            case ts.SyntaxKind.EnumMember:
                                properties = _.merge(
                                    properties,
                                    this.getEnumMemberProperty(child, keyword)
                                )
                                break
                        }
                    })
                    break
                default:
                // console.log("buildEnum",child.kind, child.getText())
            }
        })

        this.map = _.merge(this.map, properties)
    }

    getEnumMemberProperty(node: ts.Node, path: string): any {
        let properties: any = {}
        let flag = false
        node.getChildren().forEach((child: ts.Node) => {
            // console.log(child.kind, child.getText())

            switch (child.kind) {
                case ts.SyntaxKind.Identifier:
                    const str = child.getText()
                    path = `${path}.${str}`

                    break
                case ts.SyntaxKind.StringLiteral:
                    properties = _.update(properties, `${path}`, () =>
                        child.getText().replace(/"/g, '')
                    )
                    flag = true
                    break
            }
        })

        if (!flag) {
            properties = _.update(
                properties,
                `${path}`,
                () => path?.split('.').pop()
            )
        }

        return properties
    }

    buildProperties(node: ts.Node, path: string, parameters?: number): any {
        let properties: any = {}

        // console.log(node.getChildren())

        node.getChildren().forEach((child: ts.Node) => {
            switch (child.kind) {
                case ts.SyntaxKind.Identifier:
                    const str = child.getText()
                    path = `${path}.${str}`
                    properties = _.merge(
                        properties,
                        this.buildProperties(child, path, parameters)
                    )
                    break
                case ts.SyntaxKind.PropertySignature:
                    properties = _.merge(
                        properties,
                        this.buildProperty(child, path, parameters)
                    )
                    break
                case ts.SyntaxKind.HeritageClause:
                    const heritage = child.getChildren()[1]
                    const heritageName = child.getChildren()[0].getText()
                    properties = _.update(
                        properties,
                        `${path}.$${heritageName}`,
                        () => heritage.getText()
                    )
                    break
                case ts.SyntaxKind.TypeParameter:
                    // console.log(child.getText())
                    const regex = /(.+)=(.+)/g
                    const match = regex.exec(child.getText())

                    if (match && match.length >= 3)
                        properties = _.update(
                            properties,
                            `${path}.@${parameters}_${match[1].trim()}`,
                            () => match[2].trim()
                        )
                    if (parameters) parameters++
                    break
                // console.log(match.length)

                // if(match.length < 3) {
                //     parameters[match[1]] = match[1]
                // }else
                //     parameters[match[1]] = match[2]
                // break;

                default:
                    console.log(child.kind, child.getText())
            }
        })

        return properties
    }

    buildProperty(node: ts.Node, path: string, _parameters?: any): any {
        let properties: any = {}
        let keyword: string = ''

        const getText = (str: string) => {
            return str
        }

        node.getChildren().forEach((child: ts.Node) => {
            console.log(child.kind, child.getText())
            let str: string
            switch (child.kind) {
                case ts.SyntaxKind.StringKeyword:
                    properties = _.update(
                        properties,
                        `${keyword}`,
                        () => 'string'
                    )
                    break
                case ts.SyntaxKind.NumberKeyword:
                    properties = _.update(
                        properties,
                        `${keyword}`,
                        () => 'number'
                    )
                    break
                case ts.SyntaxKind.BooleanKeyword:
                    properties = _.update(
                        properties,
                        `${keyword}`,
                        () => 'boolean'
                    )
                    break
                case ts.SyntaxKind.AnyKeyword:
                    properties = _.update(properties, `${keyword}`, () => 'any')
                    break
                case ts.SyntaxKind.TypeReference:
                    properties = _.update(properties, `${keyword}`, () =>
                        getText(child.getText())
                    )
                    break
                case ts.SyntaxKind.Identifier:
                    str = getText(child.getText())
                    keyword = `${path}.${str}`
                    break
                case ts.SyntaxKind.ArrayType:
                    properties = _.update(properties, `${keyword}`, () =>
                        getText(child.getText())
                    )
                    break
                case ts.SyntaxKind.TypeLiteral:
                    properties = _.update(properties, `${keyword}`, () =>
                        this.buildInterface(child, keyword)
                    )
                    break
                case ts.SyntaxKind.UnionType:
                    const union = child
                        .getText()
                        .split('|')
                        .map((str: string) => str.replace(new RegExp(REGEX.SPECIAL_CHARACTER_PARSER, 'g'), '').trim())
                    properties = _.update(properties, `${keyword}`, () => union)
                    break
                case ts.SyntaxKind.TupleType:
                    const tuple = child.getText()
                    properties = _.update(properties, `${keyword}`, () => tuple)
                    break
                default:
                // console.log(child.kind, child.getText())
            }
        })

        return properties
    }

    toJSON() {
        const arr: any = []

        for (const key in this.map) {
            arr.push({
                name: key,
                value: this.map[key],
            })
        }

        return arr
    }
}

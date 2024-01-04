export enum TypeKind {
    Interface,
    Enum,
    Class,
    TypeAlias,
    Unknown
}

export interface IType {
    [key: string]: TypeKind;
}
export interface ApiData {
  Types: ApiType[];
}

export interface ApiType {
  Name: string;
  FullName: string;
  Namespace: string;
  Group: "class" | "struct" | "enum" | "interface";
  Assembly: string;
  Documentation: Documentation;
  DocId: string;
  BaseType?: string;
  DeclaringType?: string;
  IsPublic: boolean;
  IsClass: boolean;
  IsEnum?: boolean;
  IsInterface?: boolean;
  IsValueType?: boolean;
  IsAbstract?: boolean;
  IsSealed?: boolean;
  IsStatic?: boolean;
  IsAttribute?: boolean;
  IsExtension?: boolean;
  Constructors?: Constructor[];
  Properties?: Property[];
  Methods?: Method[];
  Fields?: Field[];
  Attributes?: AttributeInfo[];
}

export interface Documentation {
  Summary?: string;
  Remarks?: string;
  Examples?: string[];
  Params?: Record<string, string>;
  Return?: string;
  TypeParams?: Record<string, string>;
  SeeAlso?: string[];
  Exceptions?: Record<string, string>;
}

export interface Parameter {
  Name: string;
  Type: string;
  Default?: string;
  IsOptional?: boolean;
  IsParams?: boolean;
  IsOut?: boolean;
  IsRef?: boolean;
}

export interface Constructor {
  Name: string;
  FullName: string;
  DeclaringType: string;
  ReturnType: string;
  Parameters?: Parameter[];
  IsPublic: boolean;
  Documentation?: Documentation;
  DocId: string;
  Attributes?: AttributeInfo[];
}

export interface Property {
  Name: string;
  FullName: string;
  PropertyType: string;
  IsPublic: boolean;
  IsStatic?: boolean;
  IsVirtual?: boolean;
  IsAbstract?: boolean;
  IsSealed?: boolean;
  Documentation?: Documentation;
  DocId: string;
  Attributes?: AttributeInfo[];
}

export interface Method {
  Name: string;
  FullName: string;
  DeclaringType: string;
  ReturnType: string;
  Parameters?: Parameter[];
  IsPublic: boolean;
  IsStatic?: boolean;
  IsVirtual?: boolean;
  IsAbstract?: boolean;
  IsSealed?: boolean;
  IsExtension?: boolean;
  Documentation?: Documentation;
  DocId: string;
  Attributes?: AttributeInfo[];
}

export interface Field {
  Name: string;
  FullName: string;
  FieldType: string;
  IsPublic: boolean;
  IsStatic?: boolean;
  IsReadOnly?: boolean;
  IsConst?: boolean;
  ConstantValue?: unknown;
  Documentation?: Documentation;
  DocId: string;
  Attributes?: AttributeInfo[];
}

export interface AttributeInfo {
  FullName: string;
  Properties?: Record<string, unknown>;
}

export interface NavItem {
  name: string;
  fullName: string;
  slug: string;
  group: string;
}

export interface NamespaceGroup {
  namespace: string;
  types: NavItem[];
}

export interface NamespaceTreeNode {
  name: string;
  fullPath: string;
  types: NavItem[];
  children: NamespaceTreeNode[];
  totalTypes: number;
}

declare module '*.css'

declare type Pos = Readonly<[number, number]>;
declare type Vector = Readonly<[number, number]>;
declare type LineSegment = Readonly<[Pos, Pos]>;
declare type Paths = Pos[];

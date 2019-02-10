declare module '*.css'

declare type Point = Readonly<[number, number]>;
declare type Vector = Readonly<[number, number]>;
declare type LineSegment = Readonly<[Point, Point]>;
declare type Path = Point[];

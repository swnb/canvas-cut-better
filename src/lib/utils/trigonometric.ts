type Deg = [number, number];

export const cosDegPlus = ([aCos, aSin]: Deg, [bCos, bSin]: Deg) => aCos * bCos - aSin * bSin;
export const sinDegPlus = ([aCos, aSin]: Deg, [bCos, bSin]: Deg) => aSin * bCos + aCos * bSin;
export const totalDegPlus = ([aCos, aSin]: Deg, [bCos, bSin]: Deg): Deg => [aCos * bCos - aSin * bSin, aSin * bCos + aCos * bSin];

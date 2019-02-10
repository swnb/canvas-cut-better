export const path2clipPath = (path: Path): string => `polygen${path.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(",")}`;

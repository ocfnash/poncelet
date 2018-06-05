export const svgPathFromPts = ps => ps.slice(1).reduce((s, p) => s + ` L ${p.x} ${p.y}`, `M ${ps[0].x} ${ps[0].y}`);

export const svgEllipsePath = (x, y, rx, ry) => `M ${x + rx} ${y} A ${rx} ${ry} 0 0 0 ${x - rx} ${y} A ${rx} ${ry} 0 0 0 ${x + rx} ${y}`;

export const svgCirclePath = (x, y, r) => svgEllipsePath(x, y, r, r);

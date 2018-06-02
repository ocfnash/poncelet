import Roots from './cubic-roots';

export const phiFromEllipseCoords = (a, b, x, y) => Math.atan2(a*y, b*x);

export const ellipseCoordsFromPhi = (a, b, r, phi) => (
  {
    x: a/r * Math.cos(phi),
    y: b/r * Math.sin(phi)
  }
);

export const cayleyCubicRoots = (a, b, r) => ([-a*a, -b*b, -r*r]);

export function cayleyCoordsFromRoots(roots) {
  roots = roots.map(r => 1/r);
  const e1 = roots.reduce((a, b) => a+b, 0);
  const e2 = roots[0]*roots[1] + roots[1]*roots[2] + roots[2]*roots[0];
  const e3 = roots.reduce((a, b) => a*b, 1);
  return {
    x: e2/(e1*e1),
    y: e3/(e1*e1*e1)
  };
}

export function rootsFromCayleyCoords(x, y) {
  const roots = Roots.getCubicRoots(y, -x, 1, -1);
  return {
    realRootComps: roots.map(z => z.real).sort((u, v) => u-v),
    maxImagComp: roots.reduce((m, z) => Math.max(m, Math.abs(z.imag)), 0)
  };
}

export function ponceletIterate(a, b, r, phi) {
  // Direct algebraic expressions for this appear extremely messy. Neatest
  // analytic approach requires Jacobi amplitide function and incomplete
  // elliptic integral of first kind (not available in Javascript). Hence
  // indirect approach taken.
  const p = ellipseCoordsFromPhi(a, b, r, phi);
  const psi = ponceletIterateGetPsi(p.x, p.y, phi);
  const t = -2*(p.x*Math.cos(psi)/(a**2) + p.y*Math.sin(psi)/(b**2))/((Math.cos(psi)/a)**2 + (Math.sin(psi)/b)**2);
  return phiFromEllipseCoords(a, b, p.x + t*Math.cos(psi), p.y + t*Math.sin(psi));
}

function normaliseAngle(phi) {
  phi = phi % (2 * Math.PI);
  if (phi < 0) {
    phi += 2 * Math.PI;
  }
  return phi;
}

function ponceletIterateGetPsi(x, y, phi) {
   phi = normaliseAngle(phi);
   const d = Math.sqrt(x*x + y*y);
   const ac1 = Math.acos(1/d);
   var ac2 = Math.acos(x/d);
   if (phi > Math.PI) {
     ac2 = -ac2;
   }
   return ac1 + ac2 + Math.PI/2;
}

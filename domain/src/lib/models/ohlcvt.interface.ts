export interface OHCLVT {
    c: number; // closing price
    h: number; // highest price
    l: number; // lowest price
    n: number; // num transactions
    o: number; // open price
    otc: boolean;
    t: number; // unix msec timestamp
    v: number; // volume
    vw: number; // volume weighted average price
}
import { Application } from "express";
interface ServerOptions {
    database: string | object;
}
export declare const createServer: ({ database }: ServerOptions) => Application;
export {};

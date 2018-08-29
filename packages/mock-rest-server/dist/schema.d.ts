import { schema } from "normalizr";
export declare const transactionSchema: schema.Entity;
export declare const accountSchema: schema.Entity;
export declare const contactSchema: schema.Entity;
export declare const userSchema: schema.Entity;
export declare const normalizeUser: (user: any) => {
    entities: any;
    result: any;
};

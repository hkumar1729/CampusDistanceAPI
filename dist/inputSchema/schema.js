"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const schema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
    latitude: zod_1.z.number().min(-90).max(90).default(0),
    longitude: zod_1.z.number().min(-180).max(180).default(0),
});
exports.default = schema;

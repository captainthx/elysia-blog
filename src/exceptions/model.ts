import { t } from "elysia";

export namespace ExceptionModel {
    export const errorResponse = t.Object({
        error: t.String(),
        code: t.Number()
    })
    export type errorResponse = typeof errorResponse.static;
}

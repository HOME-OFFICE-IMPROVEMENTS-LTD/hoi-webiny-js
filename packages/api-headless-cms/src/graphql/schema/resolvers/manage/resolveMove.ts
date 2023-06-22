import { ErrorResponse, Response } from "@webiny/handler-graphql/responses";
import { CmsEntryResolverFactory as ResolverFactory } from "~/types";

interface ResolveMoveArgs {
    revision: string;
    folderId: string;
}

type ResolveMove = ResolverFactory<any, ResolveMoveArgs>;

export const resolveMove: ResolveMove =
    ({ model }) =>
    async (_, args: any, context) => {
        const { revision, folderId } = args;
        try {
            if (!folderId) {
                throw new Error(`The input value "folderId" is required!`);
            }
            const entry = await context.cms.updateEntry(model, revision, {
                wbyAco_location: {
                    folderId
                }
            });

            return new Response(entry.location?.folderId === folderId);
        } catch (e) {
            return new ErrorResponse(e);
        }
    };
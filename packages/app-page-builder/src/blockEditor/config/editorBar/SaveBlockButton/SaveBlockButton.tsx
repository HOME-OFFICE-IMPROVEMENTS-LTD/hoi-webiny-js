import React, { useCallback } from "react";
import { useRouter } from "@webiny/react-router";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { ButtonPrimary } from "@webiny/ui/Button";
import { Compose, HigherOrderComponent, makeComposable } from "@webiny/app-admin";
import { EditorBar } from "~/editor";
import { useEventActionHandler } from "~/editor/hooks/useEventActionHandler";
import { UpdateDocumentActionEvent } from "~/editor/recoil/actions";
import { useBlock } from "~/blockEditor/hooks/useBlock";

const DefaultSaveBlockButton: React.FC = () => {
    const [block] = useBlock();
    const eventActionHandler = useEventActionHandler();
    const { history } = useRouter();
    const { showSnackbar } = useSnackbar();

    const saveChanges = useCallback(() => {
        eventActionHandler.trigger(
            new UpdateDocumentActionEvent({
                debounce: false,
                onFinish() {
                    history.push(
                        `/page-builder/blocks?id=${encodeURIComponent(block.id as string)}`
                    );

                    // Let's wait a bit, because we are also redirecting the user.
                    setTimeout(() => {
                        showSnackbar("Your page was published successfully!");
                    }, 500);
                }
            })
        );
    }, [block.id]);

    return <ButtonPrimary onClick={saveChanges}>Save Changes</ButtonPrimary>;
};

export const SaveBlockButton = makeComposable("SaveBlockButton", DefaultSaveBlockButton);

const AddSaveBlockButton: HigherOrderComponent = RightSection => {
    return function AddSaveBlockButton(props) {
        return (
            <RightSection>
                <SaveBlockButton />
                {props.children}
            </RightSection>
        );
    };
};

export const SaveBlockButtonPlugin = () => {
    return <Compose component={EditorBar.RightSection} with={AddSaveBlockButton} />;
};
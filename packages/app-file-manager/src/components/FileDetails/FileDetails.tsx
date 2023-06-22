import React, { useState, useMemo } from "react";
// @ts-ignore
import { useHotkeys } from "react-hotkeyz";
import omit from "lodash/omit";
import styled from "@emotion/styled";
import { FileItem } from "@webiny/app-admin/types";
import { Form, FormOnSubmit } from "@webiny/form";
import { Drawer, DrawerContent } from "@webiny/ui/Drawer";
import { CircularProgress } from "@webiny/ui/Progress";
import { Cell, Grid } from "@webiny/ui/Grid";
import { Tab, Tabs } from "@webiny/ui/Tabs";
import { Aliases } from "./components/Aliases";
import { Name } from "./components/Name";
import { Tags } from "./components/Tags";
import { FileDetailsProvider } from "~/components/FileDetails/FileDetailsProvider";
import { Preview } from "./components/Preview";
import { PreviewMeta } from "./components/PreviewMeta";
import { Actions } from "./components/Actions";
import { Header } from "./components/Header";
import { Elevation } from "@webiny/ui/Elevation";
import { Content } from "./components/Content";
import { SimpleForm } from "@webiny/app-admin/components/SimpleForm";
import { Footer } from "./components/Footer";
import { Extensions } from "./components/Extensions";
import { useFileModel } from "~/hooks/useFileModel";
import { useFileManagerView, useFileManagerViewConfig } from "~/index";
import { useSnackbar } from "@webiny/app-admin";
import { useFileDetails } from "~/hooks/useFileDetails";
import { FileProvider } from "~/contexts/FileProvider";

type FileDetailsDrawerProps = React.ComponentProps<typeof Drawer> & { width: string };

const FileDetailsDrawer = styled(Drawer)<FileDetailsDrawerProps>`
    &.mdc-drawer {
        width: ${props => props.width};
    }
`;

const FormContainer = styled(SimpleForm)`
    margin: 0;
    /* Fix for the dir=rtl when a form is inside a drawer placed on the right side */
    .mdc-floating-label {
        transform-origin: left top !important;
        left: 16px !important;
        right: initial !important;
    }
`;

interface FileDetailsInnerProps {
    file: FileItem;
    onClose: () => void;
}

const FileDetailsInner: React.FC<FileDetailsInnerProps> = ({ file }) => {
    const [isLoading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();
    const fileModel = useFileModel();
    const { updateFile } = useFileManagerView();
    const { close } = useFileDetails();

    const hasExtensions = useMemo(() => {
        return fileModel.fields.find(field => field.fieldId === "extensions");
    }, [fileModel]);

    const onSubmit: FormOnSubmit<FileItem> = async ({ id, ...data }) => {
        setLoading(true);
        await updateFile(id, omit(data, ["createdBy", "createdOn", "src"]));
        setLoading(false);
        showSnackbar("File updated successfully!");
        close();
    };

    return (
        <Form data={file} onSubmit={onSubmit}>
            {() => (
                <DrawerContent dir="ltr">
                    {isLoading ? <CircularProgress label={"Saving file..."} /> : null}
                    <FormContainer>
                        <Header />
                        <Content>
                            <Content.Panel>
                                <Elevation z={2} style={{ margin: 20 }}>
                                    <Actions />
                                    <Preview />
                                    <PreviewMeta />
                                </Elevation>
                            </Content.Panel>
                            <Content.Panel>
                                <Tabs>
                                    <Tab label={"Basic Details"}>
                                        <Grid>
                                            <Cell span={12}>
                                                <Name />
                                            </Cell>
                                            <Cell span={12}>
                                                <Tags />
                                            </Cell>
                                            <Cell span={12}>
                                                <Aliases />
                                            </Cell>
                                        </Grid>
                                    </Tab>
                                    {hasExtensions ? (
                                        <Tab label={"Advanced Details"}>
                                            <Extensions model={fileModel} />
                                        </Tab>
                                    ) : null}
                                </Tabs>
                            </Content.Panel>
                        </Content>
                        <Footer />
                    </FormContainer>
                </DrawerContent>
            )}
        </Form>
    );
};

export interface FileDetailsProps {
    file?: FileItem;
    open: boolean;
    loading: boolean;
    onClose: () => void;
}

export const FileDetails: React.FC<FileDetailsProps> = ({ open, onClose, loading, file }) => {
    useHotkeys({
        zIndex: 55,
        disabled: !open,
        keys: {
            esc: onClose
        }
    });

    const { fileDetails } = useFileManagerViewConfig();

    return (
        <FileDetailsDrawer
            width={fileDetails.width}
            dir="rtl"
            modal
            open={open}
            onClose={onClose}
            data-testid={"fm.file-details.drawer"}
        >
            <DrawerContent dir="ltr">
                {loading && <CircularProgress label={"Loading file details..."} />}
                {file && (
                    <FileProvider file={file}>
                        <FileDetailsProvider hideFileDetails={onClose}>
                            <FileDetailsInner file={file} onClose={onClose} />
                        </FileDetailsProvider>
                    </FileProvider>
                )}
            </DrawerContent>
        </FileDetailsDrawer>
    );
};
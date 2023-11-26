import React from "react";
import MDEditor from "@uiw/react-md-editor";

function MarkDownEditor({ content, setContent, isReadOnly = false }) {
    if (isReadOnly) {
        return (
            <div data-color-mode="light">
                <MDEditor.Markdown source={content} style={{ whiteSpace: "pre-wrap" }} />
            </div>
        );
    } else {
        return (
            <div data-color-mode="light">
                <MDEditor height={500} value={content} onChange={setContent} />
            </div>
        );
    }
}

export default MarkDownEditor;

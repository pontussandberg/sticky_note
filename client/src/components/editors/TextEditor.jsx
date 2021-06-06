import React, { useState, useEffect, useRef } from 'react';
import createQuill from '../../lib/utils/create-quill';
import TextEditorToolbar from './TextEditorToolbar';


function TextEditor(props) {
    // ref to the textDoc dom element
    const textDocRef = useRef();
    const [quill, setQuill] = useState(null);
    const [noteHeader, setNoteHeader] = useState(props.textDoc.noteHeader);
    const [contentHTML, setContentHTML] = useState(props.textDoc.contentHTML);

    // Saving the current values of the textDoc to textDocs state var
    useEffect(() => {
        if (contentHTML !== props.textDoc.contentHTML || noteHeader !== props.textDoc.noteHeader) {
            props.onTextDocUpdate(props.textDoc.quillID, contentHTML, noteHeader)
        }
    }, [props, noteHeader, contentHTML]);

    // Initializing Quill and onTextChange handler if they aren't already.
    useEffect(() => {
        if (!quill) {
            // Initializing QuillJS instance.
            const quill = createQuill(props.textDoc);
            if (props.textDoc.contentHTML) {
                quill.container.firstChild.innerHTML = props.textDoc.contentHTML;
            }

            // On text handler for quill.
            quill.on('text-change', () => {
                const textDocHTML = quill.container.firstChild.innerHTML;
                const noteHeading = new DOMParser().parseFromString(textDocHTML, "text/html");
                const children = noteHeading.body.children;

                // Creating the heading for menu
                const firstElem = children.length && [...children].find(x => x.innerText.trim().length > 0);
                const headingStr = firstElem
                    ? firstElem.innerText
                    : 'Empty Document';

                setNoteHeader(headingStr);
                setContentHTML(textDocHTML);
            });
            setQuill(quill);
        }
    }, [props.textDoc, quill, contentHTML]);

    return (
        <div className="text-editor" ref={textDocRef}>
            <TextEditorToolbar id={props.textDoc.toolbarID} isSaving={props.isSaving} />
            <div className="textarea" id={props.textDoc.quillID}></div>
        </div>
    );
}

export default TextEditor;
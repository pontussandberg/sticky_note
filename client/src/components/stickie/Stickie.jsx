import React, { useState, useEffect, useRef } from 'react';
import createQuill from '../../lib/utils/create-quill';
import StickieToolbar from './StickieToolbar';


function Stickie(props) {
    // ref to the stickie dom element 
    const stickieRef = useRef();
    const [quill, setQuill] = useState(null);
    const [noteHeader, setNoteHeader] = useState(props.stickie.noteHeader);
    const [contentHTML, setContentHTML] = useState(props.stickie.contentHTML);

    // Saving the current values of the stickie to stickies state in App.js
    useEffect(() => {
        if (contentHTML !== props.stickie.contentHTML || noteHeader !== props.stickie.noteHeader) {
            props.onStickiesUpdate(props.stickie.quillID, contentHTML, noteHeader)
        }
    }, [props, noteHeader, contentHTML]);

    // Initializing Quill and onTextChange handler if they aren't already.
    useEffect(() => {
        if (!quill) {
            // Initializing QuillJS instance.
            const quill = createQuill(props.stickie);
            if (props.stickie.contentHTML) {
                quill.container.firstChild.innerHTML = props.stickie.contentHTML;
            }

            // On text handler for quill.
            quill.on('text-change', () => {
                const stickieHTML = quill.container.firstChild.innerHTML;
                const noteHeading = new DOMParser().parseFromString(stickieHTML, "text/html");
                const children = noteHeading.body.children;

                // Creating the heading for menu
                const firstElem = children.length && [...children].find(x => x.innerText.trim().length > 0);
                const headingStr = firstElem
                    ? firstElem.innerText
                    : 'Empty note';

                setNoteHeader(headingStr);
                setContentHTML(stickieHTML);
            });
            setQuill(quill);
        }
    }, [props.stickie, quill, contentHTML]);

    return (
        <div className="stickie" ref={stickieRef}>
            <StickieToolbar id={props.stickie.toolbarID} isSaving={props.isSaving} />
            {/* <div id="editor-container"></div> */}
            <div className="textarea" id={props.stickie.quillID}></div>
        </div>
    );
}

export default Stickie;
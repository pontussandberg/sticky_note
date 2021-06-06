import Quill from 'quill';

const createQuill = textDoc => new Quill('#' + textDoc.quillID, {
    modules: {
        syntax: true,
        toolbar: '#' + textDoc.toolbarID
    },
    theme: 'snow',
    placeholder: '',
});

export default createQuill;
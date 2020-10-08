import Quill from 'quill';

const createQuill = stickie => new Quill('#' + stickie.quillID, {
    modules: {
        syntax: true,
        toolbar: '#' + stickie.toolbarID
    },
    theme: 'snow',
    placeholder: '',
});

export default createQuill;
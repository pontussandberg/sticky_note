const updateLocalStorage = data => {
    localStorage.setItem('textDocs', JSON.stringify(data));
}

export default updateLocalStorage
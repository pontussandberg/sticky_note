const updateLocalStorage = data => {
    localStorage.setItem('stickies', JSON.stringify(data));
}

export default updateLocalStorage
import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import shortid from 'shortid';
import { guideStr } from './guide_string.json';
import { getNotes, updateAllDB, authenticate } from './lib/db_connections';
import { colToList } from './lib/utils/modeling';
import { displayFirstTextDoc } from './lib/utils/helpers';
import updateLocalStorage from './lib/update_LS';
import Board from './components/Board';
import SideBar from './components/sidebar/Sidebar';
import Login from './components/Login';

let hotSaveTimeout;
const mobileSize = 1200;

const cssVars = {
    light: [
        { varName: '--primary', value: '#edf0f1' },
        { varName: '--primary-indent', value: '#dddddd' },
        { varName: '--blue', value: '#7191d1' },
        { varName: '--select', value: '#253ea1' },
        { varName: '--editor-bg', value: '#FFF' },
        { varName: '--toolbar-bg', value: '#FFF' },
        { varName: '--editor-text', value: '#111' },
        { varName: '--text', value: '#111' },
        { varName: '--editor-icon', value: '#111' },
        { varName: '--cta', value: '#06c' },
        { varName: '--code-block', value: '#292C3E' },
        { varName: '--logout-btn-color', value: '#dd2b3d' },
        { varName: '--border', value: '#ccc' },
        { varName: '--text-secondary', value: '#474747' },
        { varName: '--editor-code-block', value: '#41434d' },
    ],
    dark: [
        { varName: '--primary', value: '#15141B' },
        { varName: '--primary-indent', value: '#41434d' },
        { varName: '--blue', value: '#34353d' },
        { varName: '--select', value: '#464953' },
        { varName: '--editor-bg', value: '#3D3F44' },
        { varName: '--toolbar-bg', value: '#3D3F44' },
        { varName: '--editor-text', value: '#FFF' },
        { varName: '--text', value: '#FFF' },
        { varName: '--editor-icon', value: '#FFF' },
        { varName: '--cta', value: '#3e445f' },
        { varName: '--code-block', value: '#41434d' },
        { varName: '--logout-btn-color', value: '#FFF' },
        { varName: '--border', value: '#27252e' },
        { varName: '--text-secondary', value: '#a5a5a5' },
        { varName: '--editor-code-block', value: '#212227' },
    ]
}

const setCssVar = (varName, value) => {
    document
        .documentElement
        .style
        .setProperty(varName, value)
}

const filterEmptyTextDocs = (textDocs) => {
    return textDocs.filter(textDoc => textDoc.contentHTML.length > 0)
}

const filterDuplicates = (textDocs) => {
    const addedIds = []
    return textDocs.filter(textDoc => {
        if (addedIds.some(x => x === textDoc.quillID)) {
            return false
        }
        addedIds.push(textDoc.quillID)
        return true;
    })
}

const initTextDoc = () => [{
    quillID: 'q' + shortid.generate(),
    toolbarID: 't' + shortid.generate(),
    noteHeader: 'Empty Note',
    isDisplayed: true,
    contentHTML: ''
}];

const getSavedTheme = () => {
    const savedTheme = JSON.parse(localStorage.getItem('isLightMode'))
    return savedTheme !== null
        ? savedTheme
        : false
}

const App = () => {

    // # State #
    const [textDocs, setTextDocs] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLightMode, setIsLightMode] = useState(getSavedTheme());
    const [canSwitchMode, setCanSwitchMode] = useState(true)
    const [isLoginModalActive, setIsLoginModalActive] = useState(false)
    // -->


    // If OS has dark mode and current stick_note mode is light,
    // setting sticky_note mode to dark and setting this state to Local Storage.
    useEffect(() => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches && isLightMode) {
            handleLightModeToggle()
        }
    }, [])

    useEffect(() => {
        const colors = isLightMode
            ? cssVars.light
            : cssVars.dark

        colors.forEach(x => setCssVar(x.varName, x.value))
    }, [isLightMode])

    const initTextDocsDB = savedTextDocs => {
        setIsLoading(true);

        if (savedTextDocs && savedTextDocs.length > 0) {
            savedTextDocs = filterEmptyTextDocs(savedTextDocs)
            getNotes()
                .then(db => displayFirstTextDoc([...db, ...savedTextDocs]))
                .then(filterDuplicates)
                .then(merged => updateStateDB(merged))
                .then(() => localStorage.clear())
                .then(() => setIsLoading(false))
                .catch(console.log);
        }
        else {
            getNotes()
                .then(db => db && db.length > 0
                    ? setTextDocs(db)
                    : updateStateDB(initTextDoc())
                )
                .then(() => setIsLoading(false))
        }
    }

    // ### EFFECTS ###
    useEffect(() => {
        authenticate()
            .then((res) => {
                if (res) {
                    res.authentic
                        ? setAuthorized(true)
                        : setAuthorized(false)
                }
            });
    }, []);

    // Initializing state with saved textDocs either in localstorage
    // or DB. If textDocs are saved in LS and the user is authorized,
    // LS will be cleared and merged with DB.
    useEffect(() => {
        let savedTextDocs = JSON.parse(localStorage.getItem('textDocs'));
        savedTextDocs = savedTextDocs === null
            ? []
            : savedTextDocs

        const savedTextDocsList = Array.isArray(savedTextDocs)
            ? savedTextDocs
            : colToList(savedTextDocs)


        authorized
            ? initTextDocsDB(savedTextDocsList)
            : savedTextDocsList === null
                ? setTextDocs(initTextDoc())
                : setTextDocs(savedTextDocsList)
    }, [authorized]);

    useEffect(() => {
        const cb = () => window.innerWidth < mobileSize
            ? setIsMobile(true)
            : setIsMobile(false);

        window.addEventListener('resize', cb)
        return () => window.removeEventListener('resize', cb)
    });


    useEffect(() => {
        window.innerWidth < mobileSize
            ? setIsMobile(true)
            : setIsMobile(false);
    }, [])

    // ### HANDLERS ###

    // Updating state when en editor updates, has to stop typing for
    // 3 secs before the request is made.
    const handleTextDocUpdate = (quillID, contentHTML, noteHeader) => {
        clearTimeout(hotSaveTimeout);
        const result = textDocs.map(x => {
            if (x.quillID === quillID) {
                x.contentHTML = contentHTML;
                x.noteHeader = noteHeader;
            }
            return x;
        });
        setTextDocs(result);


        if (authorized) {
            setIsSaving(true)
            hotSaveTimeout = setTimeout(() => {
                updateAllDB(result)
                    .then(res => {
                        res.status === 200
                            && setIsSaving(false)
                    })
            }, 1500)
        } else {
            updateLocalStorage(result);
        }
    };


    const updateStateDB = list => {
        if (!list) return

        // Pretty hacky tbh
        if (list.length > 0) {
            authorized
                ? updateAllDB(list)
                : updateLocalStorage(list)

            setTextDocs(list);
        }
    };


    const handleDisplayTextDoc = (quillID) => {
        const list = [...textDocs].map(x => {
            x.quillID === quillID
                ? x.isDisplayed = true
                : x.isDisplayed = false
            return x;
        });
        // Would be unnecessary to update DB here.
        setTextDocs(list);
    }

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleAdd = () => {
        const textDoc = {
            quillID: 'q' + shortid.generate(),
            toolbarID: 't' + shortid.generate(),
            noteHeader: 'Empty Note',
            isDisplayed: true,
            contentHTML: ''
        }
        const textDocsCopy = [...textDocs];
        textDocsCopy.forEach(textDoc => textDoc.isDisplayed = false);

        textDocsCopy.unshift(textDoc);
        updateStateDB(textDocsCopy);
    }

    const handleRemove = (quillID) => {
        const filtered = [...textDocs].filter(x => x.quillID !== quillID);

        if (filtered.length === 0) {
            filtered.push(...initTextDoc())
        }

        const isOneDisplayed = filtered.some(x => x.isDisplayed);
        if (!isOneDisplayed) {
            filtered[0].isDisplayed = true;
        }
        updateStateDB(filtered);
    }

    const handleAddGuide = () => {
        const textDoc = {
            quillID: 'q' + shortid.generate(),
            toolbarID: 't' + shortid.generate(),
            contentHTML: guideStr,
            noteHeader: 'Guide',
            isDisplayed: true
        }
        const textDocsCopy = [...textDocs];
        textDocsCopy.forEach(textDoc => textDoc.isDisplayed = false);

        updateStateDB([textDoc, ...textDocsCopy]);
    };

    const handleMoveUp = (quillID) => {
        const textDocsCopy = [...textDocs];
        textDocsCopy.forEach((x, i) => {
            if (x.quillID === quillID) {
                textDocsCopy.splice(i, 1);
                textDocsCopy.splice(i - 1, 0, x);
            }
        });
        updateStateDB(textDocsCopy);
    }


    const getAppClasses = () => !isSidebarOpen && isMobile
        ? 'app app--header-hidden'
        : 'app'

    const handleLightModeToggle = () => {
        if (canSwitchMode) {
            setCanSwitchMode(false)
            setTimeout(() => {
                setCanSwitchMode(true)
            }, 1600)

            setIsLightMode(!isLightMode)
            localStorage.setItem('isLightMode', JSON.stringify(!isLightMode))
        }
    }

    const handleToggleLoginModal = () => {
        setIsLoginModalActive(!isLoginModalActive)
    }

    const handleLogOut = () => {
        setAuthorized(false)
    }

    return (
        <div className={getAppClasses()}>
            { isLoginModalActive ? <Login onToggleLoginModal={handleToggleLoginModal} /> : null}
            <SideBar
                isLoading={isLoading}
                onMoveUp={handleMoveUp}
                onAddGuide={handleAddGuide}
                isSidebarOpen={isSidebarOpen}
                onSidebarToggle={handleSidebarToggle}
                displayTextDoc={handleDisplayTextDoc}
                isMobile={isMobile}
                onRemove={handleRemove}
                onAdd={handleAdd}
                textDocs={textDocs}
                onLogout={handleLogOut}
                isLightMode={isLightMode}
                authorized={authorized}
                onLightModeToggle={handleLightModeToggle}
                onToggleLoginModal={handleToggleLoginModal}
            />
            <Board
                isSaving={isSaving}
                isLoading={isLoading}
                onTextDocUpdate={handleTextDocUpdate}
                isSidebarOpen={isSidebarOpen}
                isMobile={isMobile}
                onRemove={handleRemove}
                textDocs={textDocs}
            />
        </div>
    );
}

export default App;

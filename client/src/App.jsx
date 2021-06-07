import React, { useState, useEffect } from 'react';
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
        { varName: '--bg', value: '#fff' },
        { varName: '--editor-bg', value: '#FFF' },
        { varName: '--editor-bg-darker', value: '#eee' },
        { varName: '--primary', value: '#FFF' },
        { varName: '--secondary', value: '#FFF' },
        { varName: '--text', value: '#363950' },
        { varName: '--text-secondary', value: '#474747' },
        { varName: '--cta', value: '#007aff' },
        { varName: '--tab-border', value: '#BFBFBF' },
        { varName: '--logout-btn-color', value: '#dd2b3d' },
        { varName: '--editor-code-block', value: '#41434d' },

        { varName: '--icon', value: '#8D8D8D' },
        { varName: '--active-toolbar-icon', value: '#007aff' },


        { varName: '--border', value: '1px solid #ddd' },
        { varName: '--secondary-border', value: '1px solid rgba(0, 0, 0, .35)' },
        { varName: '--primary-border', value: '2px solid var(--cta)' },
        { varName: '--sidebar-border', value: 'var(--border)' },
    ],
    dark: [
        { varName: '--bg', value: '#15141B' },
        { varName: '--editor-bg', value: '#3D3F44' },
        { varName: '--editor-bg-darker', value: '#34363a' },
        { varName: '--primary', value: '#464953' },
        { varName: '--secondary', value: '#34353d' },
        { varName: '--text', value: '#FFF' },
        { varName: '--text-secondary', value: '#a5a5a5' },
        { varName: '--cta', value: '#3e445f' },
        { varName: '--tab-border', value: '#515358' },
        { varName: '--logout-btn-color', value: '#FFF' },
        { varName: '--editor-code-block', value: '#212227' },

        { varName: '--icon', value: '#bbb' },
        { varName: '--active-toolbar-icon', value: '#8196FF' },

        { varName: '--border', value: '1px solid #27252e' },
        { varName: '--primary-border', value: 'none' },
        { varName: '--secondary-border', value: 'none' },
        { varName: '--sidebar-border', value: 'none' },
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


    const initTextDoc = () => [{
        quillID: 'q' + shortid.generate(),
        toolbarID: 't' + shortid.generate(),
        noteHeader: 'Empty Note',
        isDisplayed: true,
        contentHTML: '',
        tabPos: getNextTabPos(),
    }];


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
                .then(tabOnlyDisplayedTextDoc)
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
                : setTextDocs(tabOnlyDisplayedTextDoc(savedTextDocsList))
    }, [authorized]);


    useEffect(() => {
        const cb = () => window.innerWidth < mobileSize
            ? setIsMobile(true)
            : setIsMobile(false);

        cb()

        window.addEventListener('resize', cb)
        return () => window.removeEventListener('resize', cb)
    }, []);


    // ### HANDLERS ###

    // Updating state when en editor updates, has to stop typing for
    // 3 secs before the request is made.
    const handleTextDocUpdate = (quillID, contentHTML, noteHeader) => {
        clearTimeout(hotSaveTimeout)
        const result = textDocs.map(x => {
            if (x.quillID === quillID) {
                x.contentHTML = contentHTML
                x.noteHeader = noteHeader
            }
            return x
        });
        setTextDocs(result)


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
            updateLocalStorage(result)
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

    const tabOnlyDisplayedTextDoc = (list) => {
        return list.map(x => {
            const tabPos = x.isDisplayed ? 0 : -1
            return {
                ...x,
                tabPos
            }
        })
    }

    const getFirstTabPos = (docs) => {
        let currFirstTabPos = -1
        docs.forEach(doc => {
            if (currFirstTabPos === -1 || (doc.tabPos !== -1 && doc.tabPos < currFirstTabPos)) {
                currFirstTabPos = doc.tabPos
            }
        })

        return currFirstTabPos
    }

    const getNextTabPos = () => {
        let currLastTabPos = -1
        textDocs.forEach(doc => {
            if (doc.tabPos > currLastTabPos) {
                currLastTabPos = doc.tabPos
            }
        })

        return currLastTabPos + 1
    }

    const handleDisplayTextDoc = (quillID) => {
        const textDocsList = [...textDocs].map(doc => {

            // Tab Position
            if (doc.quillID === quillID && doc.tabPos === -1) {
                doc.tabPos = getNextTabPos()
            }

            // Displayed on board
            if (doc.quillID === quillID) {
                doc.isDisplayed = true
            } else {
                doc.isDisplayed = false
            }

            return doc;
        });

        setTextDocs(textDocsList)
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
            contentHTML: '',
            tabPos: getNextTabPos(),
        }
        const textDocsCopy = [...textDocs]
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
            isDisplayed: true,
            tabPos: getNextTabPos(),
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

    const handleCloseTab = (quillID) => {
        const result = [...textDocs].map(textDoc => {
            const isTarget = textDoc.quillID === quillID
            const tabPos = isTarget ? -1 : textDoc.tabPos
            const isDisplayed = textDoc.quillID === quillID && textDoc.isDisplayed
                ? false
                : textDoc.isDisplayed

            return {
                ...textDoc,
                tabPos,
                isDisplayed
            }
        })

        // If current displayed doc was closed, displaying doc with lowest $tabPos
        const firstTabPos = getFirstTabPos(result)
        const isTargetDisplayed = textDocs.some(doc => doc.quillID === quillID && doc.isDisplayed)

        if (isTargetDisplayed && firstTabPos !== -1) {
            result.find(doc => doc.tabPos === firstTabPos).isDisplayed = true
        }

        setTextDocs(result)
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
                isMobile={isMobile}
                closeTab={handleCloseTab}
                displayTextDoc={handleDisplayTextDoc}
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

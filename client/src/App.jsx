import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import shortid from 'shortid';
import { guideStr } from './guide_string.json';
import { getNotes, updateAllDB, authenticate } from './lib/db_connections';
import { colToList } from './lib/utils/modeling';
import { displayFirstStickie } from './lib/utils/helpers';
import updateLocalStorage from './lib/update_LS';
import Board from './components/Board';
import SideBar from './components/sidebar/Sidebar';
import Header from './components/Header';
import Login from './components/Login';

let hotSaveTimeout;
const mobileSize = 1200;

const cssVars = {
    light: [
        {varName: '--primary', value: '#f9f9f9'},
        {varName: '--primary-indent', value: '#dddddd'},
        {varName: '--blue', value: '#7191d1'},
        {varName: '--select', value: '#253ea1'},
        {varName: '--editor-bg', value: '#FFF'},
        {varName: '--toolbar-bg', value: '#FFF'},
        {varName: '--editor-text', value: '#111'},
        {varName: '--text', value: '#111'},
        {varName: '--editor-icon', value: '#111'},
        {varName: '--cta', value: '#06c'},
        {varName: '--code-block', value: '#292C3E'},
        {varName: '--logout-btn-color', value: '#dd2b3d'},
        {varName: '--border', value: '#ccc'},
    ],
    dark: [
        {varName: '--primary', value: '#27252e'},
        {varName: '--primary-indent', value: '#41434d'},
        {varName: '--blue', value: '#34353d'},
        {varName: '--select', value: '#464953'},
        {varName: '--editor-bg', value: '#36393f'},
        {varName: '--toolbar-bg', value: '#36393f'},
        {varName: '--editor-text', value: '#FFF'},
        {varName: '--text', value: '#FFF'},
        {varName: '--editor-icon', value: '#FFF'},
        {varName: '--cta', value: '#3e445f'},
        {varName: '--code-block', value: '#41434d'},
        {varName: '--logout-btn-color', value: '#FFF'},
        {varName: '--border', value: '#27252e'},
    ]
}

const setCssVar = (varName, value) => {
    document
        .documentElement
        .style
        .setProperty(varName, value)
}

const initStickie = () => [{
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
        : true
}

const App = () => {
    const [stickies, setStickies] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLightMode, setIsLightMode] = useState(getSavedTheme());
    const [canSwitchMode, setCanSwitchMode] = useState(true)

    // If OS has dark mode and current stick_note mode is light, 
    // setting sticky_note mode to dark and setting this state to Local Storage.
    useEffect(() => {
        if(window.matchMedia('(prefers-color-scheme: dark)').matches && isLightMode) {
            handleLightModeToggle()
        }
    }, [])

    useEffect(() => {
        const colors = isLightMode 
            ? cssVars.light
            : cssVars.dark

        colors.forEach(x => setCssVar(x.varName, x.value))
    }, [isLightMode])

    const initStickiesDB = savedStickies => {
        setIsLoading(true);
        if (savedStickies) {
            getNotes()
                .then(db => displayFirstStickie([...db, ...savedStickies]))
                .then(merged => updateStateDB(merged))
                .then(() => localStorage.clear())
                .then(() => setIsLoading(false))
                .catch(console.log);
        }
        else {
            getNotes()
                .then(notes => notes && notes.length > 0
                    ? setStickies(notes)
                    : updateStateDB(initStickie())
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

    // Initializing state with saved stickies either in localstorage
    // or DB. If stickies are saved in LS and the user is authorized,
    // LS will be cleared and merged with DB.
    useEffect(() => {
        const savedStickies = JSON.parse(localStorage.getItem('stickies'));
        const savedStickiesList = Array.isArray(savedStickies) || savedStickies === null
            ? savedStickies
            : colToList(savedStickies)

        authorized
            ? initStickiesDB(savedStickiesList)
            : savedStickiesList === null
                ? setStickies([])
                : setStickies(savedStickiesList)
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

    // Updating state when Stickie.jsx updates, has to stop typing for
    // 3 secs before the request is made.
    const handleStickiesUpdate = (quillID, contentHTML, noteHeader) => {
        clearTimeout(hotSaveTimeout);
        const result = stickies.map(x => {
            if (x.quillID === quillID) {
                x.contentHTML = contentHTML;
                x.noteHeader = noteHeader;
            }
            return x;
        });
        setStickies(result);


        if (authorized) {
            setIsSaving(true)
            hotSaveTimeout = setTimeout(() => {
                updateAllDB(result);
                setIsSaving(false)
            }, 1500)
        } else {
            updateLocalStorage(result);
        }
    };


    const updateStateDB = list => {
        authorized
            ? updateAllDB(list)
            : updateLocalStorage(list)

        setStickies(list);
    };


    const handleDisplaySticke = (quillID) => {
        const list = [...stickies].map(x => {
            x.quillID === quillID
                ? x.isDisplayed = true
                : x.isDisplayed = false
            return x;
        });
        // Would be unnecessary to update DB here.
        setStickies(list);
    }

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleAdd = () => {
        const stickie = {
            quillID: 'q' + shortid.generate(),
            toolbarID: 't' + shortid.generate(),
            noteHeader: 'Empty Note',
            isDisplayed: true,
            contentHTML: ''
        }
        const stickiesCopy = [...stickies];
        stickiesCopy.forEach(stickie => stickie.isDisplayed = false);

        stickiesCopy.unshift(stickie);
        updateStateDB(stickiesCopy);
    }

    const handleRemove = (quillID) => {
        const filtered = [...stickies].filter(x => x.quillID !== quillID);
        const isOneDisplayed = filtered.some(x => x.isDisplayed);

        if (!isOneDisplayed && filtered.length > 0) {
            filtered[0].isDisplayed = true;
        }
        updateStateDB(filtered);
    }

    const handleAddGuide = () => {
        const stickie = {
            quillID: 'q' + shortid.generate(),
            toolbarID: 't' + shortid.generate(),
            contentHTML: guideStr,
            noteHeader: 'Guide',
            isDisplayed: true
        }
        const stickiesCopy = [...stickies];
        stickiesCopy.forEach(stickie => stickie.isDisplayed = false);

        updateStateDB([stickie, ...stickiesCopy]);
    };

    const handleMoveUp = (quillID) => {
        const stickiesCopy = [...stickies];
        stickiesCopy.forEach((x, i) => {
            if (x.quillID === quillID) {
                stickiesCopy.splice(i, 1);
                stickiesCopy.splice(i - 1, 0, x);
            }
        });
        updateStateDB(stickiesCopy);
    }


    const getAppClasses = () => !isSidebarOpen && isMobile
        ? 'app app--header-hidden'
        : 'app'

    const handleLightModeToggle = () => {
        if(canSwitchMode) {
            setCanSwitchMode(false)
            setTimeout(() => {
                setCanSwitchMode(true)
            }, 1600)

            setIsLightMode(!isLightMode)
            localStorage.setItem('isLightMode', JSON.stringify(!isLightMode))
        }
    }

    return (
        <Switch>
            <Route path='/login'>
                <Login />
            </Route>
            <Route path='/'>
                <div className={getAppClasses()}>
                    <Header
                        isLightMode={isLightMode}
                        onLightModeToggle={handleLightModeToggle}
                        isSidebarOpen={isSidebarOpen}
                        onSidebarToggle={handleSidebarToggle}
                        onAddGuide={handleAddGuide}
                        authorized={authorized}
                        isMobile={isMobile}
                        onLogout={() => setAuthorized(false)}
                    />
                    <SideBar
                        authorized={authorized}
                        isLoading={isLoading}
                        onMoveUp={handleMoveUp}
                        onAddGuide={handleAddGuide}
                        isSidebarOpen={isSidebarOpen}
                        onSidebarToggle={handleSidebarToggle}
                        displayStickie={handleDisplaySticke}
                        isMobile={isMobile}
                        onRemove={handleRemove}
                        onAdd={handleAdd}
                        stickies={stickies}
                        onLogout={() => setAuthorized(false)}
                    />
                    <Board
                        isSaving={isSaving}
                        isLoading={isLoading}
                        onStickiesUpdate={handleStickiesUpdate}
                        isSidebarOpen={isSidebarOpen}
                        isMobile={isMobile}
                        onRemove={handleRemove}
                        stickies={stickies}
                    />
                </div>
            </Route>
        </Switch>
    );
}

export default App;

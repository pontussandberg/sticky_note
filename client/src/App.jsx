import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import shortid from 'shortid';
import { guideStr } from './guide_string.json';
import { getNotes, updateAllDB, authenticate } from './lib/db_connections';
// import { colToList } from './lib/utils/modeling';
import { displayFirstStickie } from './lib/utils/helpers';
import updateLocalStorage from './lib/update_LS';
import Board from './components/Board';
import SideBar from './components/sidebar/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import xx from './x.json'

let hotSaveTimeout;
const mobileSize = 1200;

const initStickie = () => [{
    quillID: 'q' + shortid.generate(),
    toolbarID: 't' + shortid.generate(),
    noteHeader: 'Empty Note',
    isDisplayed: true,
    contentHTML: ''
}];

const App = () => {
    const [stickies, setStickies] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

        authorized
            ? initStickiesDB(savedStickies)
            : savedStickies === null
                ? setStickies([])
                : setStickies(savedStickies)
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
            hotSaveTimeout = setTimeout(() => {
                updateAllDB(result);
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


    return (
        <Switch>
            <Route path='/login'>
                <Login />
            </Route>
            <Route path='/'>
                <div className={getAppClasses()}>
                    <Header
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

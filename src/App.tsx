import React, { useRef } from 'react'
import Header from './components/Header'
import EditorComponent from './components/Editor'
import './global.css'
import ResultComponent from './components/Result'

export const AppContext = React.createContext(
    {} as {
        editorRef: React.MutableRefObject<any>
    }
)

function App() {
    const editorRef = useRef<any>(null)

    return (
        <AppContext.Provider value={{ editorRef }}>
            <React.Fragment>
                <div className="flex flex-col p-5 gap-8 items-center h-screen">
                    <Header />
                    <div className="flex w-full">
                        <div className="flex-1">
                            <EditorComponent />
                        </div>
                        <div className="flex-1 w-full h-full">
                            <ResultComponent />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </AppContext.Provider>
    )
}

export default App

import { Editor } from '@monaco-editor/react'
import React from 'react'
import { AppContext } from '../../App'

function EditorComponent() {
    const { editorRef } = React.useContext(AppContext)
    return (
        <React.Fragment>
            <Editor
                height="80vh"
                defaultLanguage="typescript"
                theme="vs-dark"
                onMount={(editor) => {
                    editorRef.current = editor
                }}
            />
        </React.Fragment>
    )
}

export default EditorComponent

import { useCallback, useContext, useState } from 'react'
import { AppContext } from '../../App'
import toast, { Toaster } from 'react-hot-toast'

const url = new URL('/worker/dummyDataCreator.js', import.meta.url)
const worker = new Worker(url)

function ResultComponent() {
    const { editorRef } = useContext(AppContext)
    // const [createDummy] = useWorker(dummyDataWorker)
    const [interfaceName, setInterfaceName] = useState('')
    const [dummyData, setDummyData] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    worker.onmessage = (e) => {
        setDummyData(e.data)
        setIsLoading(false)
        toast.success('Dummy Data Created')
    }

    const createDummyHandler = useCallback(async () => {
        const editor = editorRef.current
        if (!editor) return

        const value = editor.getValue()

        console.log({ value, name: interfaceName })
        setIsLoading(true)

        worker.postMessage({
            value,
            name: interfaceName,
        })
    }, [editorRef, interfaceName, isLoading])

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(JSON.stringify(dummyData))
        toast.success('Copied to Clipboard')
    }, [dummyData])

    console.log(isLoading)

    return (
        <div className="flex-1 flex flex-col rounded-lg px-5 gap-5 h-[80vh]">
            <div className="flex-1 flex flex-col  rounded-lg bg-neutral p-4 text-neutral-content justify-center gap-4 overflow-auto">
                <div className="flex gap-2 h-4">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <div className="w-4 h-4 rounded-full bg-yellow-500" />
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <div className="w-full flex justify-end items-end">
                        <button
                            className="rounded-full btn btn-ghost -mb-8"
                            onClick={createDummyHandler}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={`w-6 h-6 ${
                                    isLoading ? 'animate-spin' : ''
                                }`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                />
                            </svg>
                        </button>
                        <button
                            className={`rounded-full btn btn-ghost -mb-8`}
                            onClick={copyToClipboard}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={`w-6 h-6`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <pre className="w-full h-full overflow-auto pl-4 ">
                    {JSON.stringify(dummyData, null, 2)}
                </pre>
            </div>
            <div className="flex gap-2  ">
                <input
                    type="text"
                    placeholder="Choose Interface Name"
                    className="w-full rounded-lg p-2 outline-none"
                    value={interfaceName}
                    onChange={(e) => setInterfaceName(e.target.value)}
                />
                <button className="px-6 btn" onClick={createDummyHandler}>
                    Create Dummy
                </button>
            </div>
            <Toaster />
        </div>
    )
}

export default ResultComponent

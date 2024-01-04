import React from 'react'
import { TEXT } from '../../constants/text'

function Header() {
    return (
        <div className="pt-10">
            <div className="flex gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 self-center text-yellow-400"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                    />
                </svg>
                <h1 className="text-2xl font-semibold"> {TEXT.TITLE}</h1>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 self-center text-yellow-400"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                    />
                </svg>
            </div>
        </div>
    )
}

export default Header

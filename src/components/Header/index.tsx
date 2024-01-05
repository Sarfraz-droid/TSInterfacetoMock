import { TEXT } from '../../constants/text'
import { SiTypescript } from 'react-icons/si'
import { FaGithub } from "react-icons/fa"
function Header() {
    return (
        <div className="pt-2 w-full">
            <div className="flex gap-2 justify-between px-5">
                <div
                    className='flex gap-2'
                >
                    <SiTypescript className="text-blue-500 w-14 h-14 self-center" />
                    <div className="flex flex-col text-primary-content pl-2 border-l-2 border-blue-500 self-center">
                        <h1 className="text-2xl font-semibold">{TEXT.TITLE}</h1>
                        <p className="opacity-70">{TEXT.SUBTITLE}</p>
                    </div>
                </div>
                <div
                    className='flex gap-2'
                >
                    <button
                        className='btn btn-ghost btn-lg rounded-full h-20 w-20'
                        onClick={() => {
                            window.open('https://github.com/Sarfraz-droid/TSInterfacetoMock', '_blank')
                        }}
                    >
                        <FaGithub className=" w-12 h-12 " />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header

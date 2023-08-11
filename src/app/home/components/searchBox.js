import React, { useState } from 'react'
export default function SeachBox(props) {
    const Vtubers = props.Vtubers
    const [searchResultList, setSearchResultList] = useState([])

    const [seachVal, setSeachVal] = useState("")
    const onChangeFunc = (e) => {
        setSeachVal(e.target.value)
        if (e.target.value == "") {
            setSearchResultList([])
            return
        }
        const searchResult = Vtubers.filter((vtuber) => {
            return vtuber.channel_title.includes(e.target.value)
        })
        setSearchResultList(searchResult)
    }
    const onClickFunc = (id) => {
        props.onCircleClick(id) 
        setSeachVal("")
        setSearchResultList([])
    }

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="absolute w-80 top-0 right-0 mt-32 m-6">
                <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm"></span>
                    </div>
                    <input
                        type="text"
                        className="block h-12 text-16 w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Search Vtubers"
                        value={seachVal}
                        onChange={(e) => { onChangeFunc(e) }}
                    />

                </div>

                <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                            {
                                searchResultList.slice(0, 5).map((vt, index) => {
                                    return (
                                        <li
                                            className="px-3 py-3 sm:py-4 cursor-pointer hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
                                            onClick={() => { onClickFunc(vt.id)}}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <img className="w-8 h-8 rounded-full" src={vt.channel_thumbnail} alt="icon" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        {vt.channel_title}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        {vt.channel_description && vt.channel_description.slice(0, 140) + ((vt.channel_description.length > 140) ? "..." : "")}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }


                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}


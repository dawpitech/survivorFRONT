"use client"
import React from 'react'
import {fetchEvents, Events} from '@/lib/events'
import Image from 'next/image'

export default function EventsPage() {
    const [events, setEvents] = React.useState<Events[]>([])

    React.useEffect(() => {
        async function getEvents() {
            const events: Events[] = await fetchEvents()
            events.sort((a: Events, b: Events) => {
                if (a.date && !b.date)
                    return -1
                if (!a.date && b.date)
                    return 1
                if (!a.date && !b.date)
                    return 0

                const dateA = new Date(a.date!)
                const dateB = new Date(b.date!)
                return dateA.getTime() - dateB.getTime()
            })
            setEvents(events)
        }
        getEvents()
    }, [])

    return (
        <main className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Upcoming events</h1>

            <section className="flex gap-8 items-start">
                <div className="flex-1">
                    <Image src="/events.png" alt="Call to action" className="flex-1" fill/>
                </div>

                <div className="flex-1 space-y-4">
                    {events.map((event: Events) => {
                        let day = "31"
                        let month = "Dec"

                        if (event.date) {
                            try {
                                const date = new Date(event.date)
                                day = date.getDate().toString()
                                month = date.toLocaleDateString('en-US', { month: 'short' })
                            } catch (error) {
                                console.error("Date parsing error:", error)
                            }
                        }

                        return (
                            <div key={event.uuid} className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg w-16 h-16 flex-shrink-0">
                                    <div className="text-xl font-bold text-gray-800">{day}</div>
                                    <div className="text-sm text-gray-600 uppercase">{month}</div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                                    <p className="text-gray-600 text-sm">{event.description || "No description available"}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}

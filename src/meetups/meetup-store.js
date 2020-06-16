import { writable } from "svelte/store";

const meetups = writable([])

const customStore = {
    subscribe: meetups.subscribe,
    setMeetups: (meetupArray) => {
        meetups.set(meetupArray)
    },
    addMeetup: (meetupData) => {
        const newMeetup = {
            ...meetupData
        }
        meetups.update(items => {
            return [newMeetup, ...items]
        })
    },
    updateMeetup: (id, meetupData) => {
        meetups.update(items => {
            const meetupIndex = items.findIndex(i => i.id === id)
            const updatedMeeup = {...items[meetupIndex], ...meetupData}
            const updatedMeetups = [...items]
            updatedMeetups[meetupIndex] = updatedMeeup
            return updatedMeetups
        })
    },
    deleteMeetup: (id) => {
        meetups.update( items => {
            return items.filter( i => i.id !== id)
        })
    },
    toggleFavourite: (id) => {
        meetups.update(items => {
                const updatedEvent = {...items.find( m => m.id === id) }
                updatedEvent.isFavourite = !updatedEvent.isFavourite
                const meetupIndex = items.findIndex(m => m.id === id)
                const updatedMeetups = [...items]
                updatedMeetups[meetupIndex] = updatedEvent
                return updatedMeetups
            }
        )
    }
}

export default customStore
<script>

    import meetups from './meetups/meetup-store.js'
    import Header from './components/Header.svelte'
    import Button from './components/Button.svelte'
    import Error from './components/Error.svelte'
    import LoadingSpinner from './components/LoadingSpinner.svelte'
    import TextInput from './components/TextInput.svelte'
    import EditMeetup from './meetups/EditMeetup.svelte'
    import MeetupGrid from './meetups/MeetupGrid.svelte'
    import MeetupDetail from './meetups/MeetupDetail.svelte'
    
    let loadedMeetups = meetups;

    let editMode = null
    let editedId
    let page = 'overview'
    let pageData = {}
    let isLoading = true
    let error;

    fetch('https://meetus-76f91.firebaseio.com/meetups.json')
    .then(res => {
        if(!res.ok){
            throw new Error('Fetching failed')
        }
        return res.json()
    })
    .then(data => {
        const loadedMeetps = []
        console.log(data)
        for(const key in data){
            loadedMeetps.push({
                ...data[key],
                id: key
            })
        }

        meetups.setMeetups(loadedMeetps.reverse())
        isLoading = false
    })
    .catch(err => {
        isLoading = false
        error = err
        console.log(err)
    })

    const saveMeetup = (event) => {
        editMode = null
        editedId = null
    }

    const cancelEdit = () => {
        editMode = null
        editedId = null
    }

    const showDetails = (event) => {
        page = 'details'
        pageData.id = event.detail
    }
    const closeDetails = () => {
        page = 'overview'
        pageData = {}
    }
    const startEdit = (event) => {
        editMode = 'edit'
        editedId = event.detail
    }

    const clearError = () => { error = null }
</script>

<style>
    main {
        margin-top: 5rem;
    }
</style>

{#if error}
     <Error message={error.message} on:close={clearError}/>
{/if}

<Header />

<main>
    {#if page === 'overview'}

        {#if editMode === 'edit'}
            <EditMeetup on:save={saveMeetup} on:close={cancelEdit} id={editedId}/>
        {/if}
        {#if isLoading}
            <LoadingSpinner />
        {:else}
            <MeetupGrid meetups={$loadedMeetups} 
                    on:showdetails={showDetails} 
                    on:edit={startEdit}/>
        {/if}
        
    {:else}
        <MeetupDetail id={pageData.id} on:close={closeDetails}/>
    {/if}
</main>
<script>
    import MeetupItem from './MeetupItem.svelte'
    import MeetupFilter from './MeetupFilter.svelte'
    import Button from "../components/Button.svelte";
    import {createEventDispatcher} from 'svelte'
    import { scale } from "svelte/transition";
    import { flip } from 'svelte/animate';

    export let meetups

    const dispatch = createEventDispatcher()

    let favsOnly = false;
    const setFilter = (event) => {
        favsOnly = event.detail === 1
    }

    $: filteredMeeups = favsOnly ? meetups.filter( i => i.isFavourite) : meetups
</script>

<style>
    #meetups {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }
    #meetup-controls {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
    }

    @media (min-width: 768px) {
        #meetups {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    #no-meetups{
        margin: 1rem;
    }
</style>

<section id="meetup-controls">
    <MeetupFilter on:select={setFilter}/>
    <Button  on:click={ () => dispatch('edit')}>New Meetup</Button>
</section>

{#if filteredMeeups.length === 0}
    <p id="no-meetups">No meetups found. Start adding some.</p>
{/if}

<section id="meetups">
    {#each filteredMeeups as meetup (meetup.id)}
    <div transition:scale animate:flip={{duration:300}}>
        <MeetupItem title={meetup.title}
            id={meetup.id}
            subtitle={meetup.subtitle}
            description={meetup.description}
            imageUrl={meetup.imageUrl}
            contact={meetup.contact}
            address={meetup.address}
            isFav={meetup.isFavourite}
            on:edit
            on:showdetails/>
        </div>
    {/each}
</section>
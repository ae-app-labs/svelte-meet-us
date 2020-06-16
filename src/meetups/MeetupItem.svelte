<script>
    import {createEventDispatcher} from 'svelte'
    import meetups from './meetup-store.js'
    import Button from '../components/Button.svelte'
    import LoadingSpinner from '../components/LoadingSpinner.svelte'
    import Badge from '../components/Badge.svelte'


    let isLoading = false
    const togglefavourite = () => {
      isLoading = true
      fetch(`https://meetus-76f91.firebaseio.com/meetups/${id}.json`, {
          method: 'PATCH',
          body: JSON.stringify( {isFavourite: !isFav} ),
          headers: { 'Content-Type': 'application/json'}
      })
      .then(res => {
        isLoading = false
        if(!res.ok){
          throw new Error('error updating favs')
        }
        meetups.toggleFavourite(id)
      })
      .catch( err => {
          isLoading = false
          console.log(err)
        })
    }
    
    const dispatch = createEventDispatcher();

    export let id
    export let title
    export let subtitle
    export let imageUrl
    export let description
    export let address
    export let contact
    export let isFav
</script>

<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 14rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  h1.is-favorite {
    background: #01a129;
    color: white;
    padding: 0 0.5rem;
    border-radius: 5px;
  }

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }
  .content{
      height: 4rem;
      
  }
</style>

<article>
    <header>
        <h1>{title} 
          {#if isFav}
            <Badge>FAVOURITE</Badge>
          {/if}
        </h1>
        <h2>{subtitle}</h2>
        <p>{address}</p>
    </header>
    <div class="image">
        <img src="{imageUrl}" alt="{title}">
    </div>
    <div class="content">
        <p>{description}</p>
    </div>
    <footer>
        <Button mode="outline" type="button" on:click={ () => { dispatch('edit', id); console.log('Edit clicked for ' + id) } }>
          Edit
        </Button>
        {#if isLoading}
           <LoadingSpinner/>
        {:else}
          <Button type="button" 
          mode="outline"
          color={ isFav ? 'null' : 'success'}
          on:click={togglefavourite}>
          { isFav ? 'Unavourite' : 'Favourite'}
          </Button>
        {/if}

        <Button type="button" on:click={ () => dispatch('showdetails', id) }>Show Details</Button>
    </footer>
</article>
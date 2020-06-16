<script>
    import meetups from './meetup-store.js'
    import Button from '../components/Button.svelte'
    import Modal from '../components/Modal.svelte'
    import TextInput from '../components/TextInput.svelte'
    import {createEventDispatcher} from 'svelte'
    import {isEmpty, isValidEmail} from '../helpers/validation.js'

    export let id = null
    let dispatch = createEventDispatcher()
    let loadedMeetups = meetups;
    let subtitle = ''
    let descritpion = ''
    let imageUrl = ''
    let title = ''
    let address = ''
    let email= ''

    if(id) {
        const unsubscribe = meetups.subscribe( items => {
            const selectedItem = items.find( i => i.id === id)
            title = selectedItem.title
            subtitle = selectedItem.subtitle
            descritpion = selectedItem.description
            imageUrl = selectedItem.imageUrl
            address = selectedItem.address
            email= selectedItem.contact
        })
        unsubscribe()
    }

    $: titleValid = !isEmpty(title)
    $: subtitleValid = !isEmpty(subtitle)
    $: descritpionValid = !isEmpty(descritpion)
    $: imageUrlValid = !isEmpty(imageUrl)
    $: addressValid = !isEmpty(address)
    $: emailValid = isValidEmail(email)
    $: formValid = titleValid && subtitleValid && descritpionValid && imageUrlValid && addressValid && emailValid

    const submitForm = () => {
        const meetupData = {
            title: title,
            subtitle: subtitle,
            description: descritpion,
            imageUrl: imageUrl,
            address: address,
            contact: email
        }
        if(id){
            fetch(`https://meetus-76f91.firebaseio.com/meetups/${id}.json`, {
                method: 'PATCH',
                body: JSON.stringify( meetupData ),
                headers: { 'Content-Type': 'application/json'}
            })
            .then(res => {
                if(!res.ok){
                    throw new Error('update failed')
                }
                loadedMeetups.updateMeetup(id, meetupData)
            })
            .catch(err => { console.log(err)})

        } else {
            fetch("https://meetus-76f91.firebaseio.com/meetups.json", {
                method:'POST',
                body: JSON.stringify( {...meetupData, isFavourite: false}),
                headers: { 'Content-Type': 'application/json'}
            })
            .then( res => {
                if(!res.ok){
                    throw new Error("not ok")
                }
                return res.json()
            })
            .then( data => {
                
                loadedMeetups.addMeetup({...meetupData, isFavourite: false, id: data.name})
            })
            .catch(err => {console.log(err)})
        }
        dispatch('save')
    }

    const cancel = () => {
        dispatch('close')
    }

    const deleteMeetup = () => {
        fetch(`https://meetus-76f91.firebaseio.com/meetups/${id}.json`, {
          method: 'DELETE'
        })
        .then(res => {
            if(!res.ok){
                throw new Error('error deleting')
            }
            loadedMeetups.deleteMeetup(id)
            dispatch('save')
        })
        .catch(err => {console.log(err)})
    }

</script>

<style>
    form {
        width: 100%;
    }
</style>

<Modal title="Edit Meetup Data" on:close>
    <form on:submit|preventDefault={submitForm}>
        <TextInput id="title" label="Title" value={title} on:input={ (event) => title = event.target.value } 
            valid={titleValid} validityMessage="Please enter a title"/>
        <TextInput id="subtitle"  label="Subitle" value={subtitle} on:input={ (event) => subtitle = event.target.value }
            valid={subtitleValid} validityMessage="Please enter a subtitle"/>
        <TextInput id="imageUrl"  label="Image URL" value={imageUrl} on:input={ (event) => imageUrl = event.target.value }
            valid={imageUrlValid} validityMessage="Please enter a image url"/>
        <TextInput id="email"  label="Email" value={email} on:input={ (event) => email = event.target.value }
            valid={emailValid} validityMessage="Please enter a email"/>
        <TextInput id="address"  label="Address" value={address} on:input={ (event) => address = event.target.value }
            valid={addressValid} validityMessage="Please enter a address"/>
        <TextInput id="descritpion" controlType="textarea" label="Description" value={descritpion} on:input={ (event) => descritpion = event.target.value }
            valid={descritpionValid} validityMessage="Please enter a description"/>
    </form>
    <div slot="footer">
        <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
        <Button type="button" on:click={submitForm} disabled={!formValid}>Save</Button>
        {#if id}
             <Button type="button" on:click={deleteMeetup}>Delete</Button>
        {/if}
    </div>
</Modal>
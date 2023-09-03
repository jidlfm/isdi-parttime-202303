import { useState, useEffect } from 'react'

import { useAppContext } from '../../hooks'

import { Container, Button, Label } from '../library'
import { EditGuestList, EditInvitedList, EditContactList } from '.'

import { retrieveUsersList, retrieveUserContacts } from '../../logic'

export default ({ listId, onAccept }) => {
    const { alert, freeze, unfreeze } = useAppContext()

    const [list, setList] = useState()
    const [contacts, setContacts] = useState()
   

    const handleRefreshEditList = async () => {
        try {
            freeze()
            const [list, contacts] = await Promise.all([ retrieveUsersList(listId), retrieveUserContacts()])
            setList(list)  
            setContacts(contacts)

            unfreeze()
        } catch(error) {
            unfreeze()
            alert(error.message)
        }
    }

    function handleAccept(event) {
        event.preventDefault()

        onAccept()
    }

    useEffect(() => {      
         handleRefreshEditList()
    }, [])

    return <>
        <Container className="modal">
            <Container tag="section">
                {list && <>
                    <Label htmlFor="nameRegister">Name:</Label>
                    <Label type="text" name="name" placeholder="name">{list.name}</Label>
                    <Label htmlFor="emailRegister">Date End:</Label>
                    <Label type="date" name="date">{list.dateToEnd}</Label>
                </>
                || <>
                    <Label htmlFor="nameRegister">Name:</Label>
                    <Label type="text" name="name" placeholder="name" />
                    <Label htmlFor="emailRegister">Date End:</Label>
                    <Label type="date" name="date" />
                </>}
            </Container>
            <Container tag="section">
                <h2>Guest</h2>
                {list && list.guests && list.guests.map(contact => <EditGuestList 
                    key={contact.id} 
                    contact={contact} 
                    />)
                }

            </Container>
            <Container tag="section">
                <h2>Invited</h2>
                {list && list.invited && list.invited.map(contact => <EditInvitedList
                    key={contact.id} 
                    contact={contact} 
                    listId={listId}
                    onModifyContact={handleRefreshEditList}
                    />)
                }
            </Container>
            <Container tag="article">
                <h2>Add contact</h2>
                {contacts && contacts.map(contact => <EditContactList
                    key={contact.id} 
                    contact={contact} 
                    listId={listId}
                    onInvitedContact={handleRefreshEditList}
                    />)
                }
            </Container>
            <Button onClick={handleAccept}>Accept</Button>
        </Container>
    </>
}
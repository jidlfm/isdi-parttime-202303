import { useState, useEffect } from 'react'

import { useAppContext } from '../../hooks'

import { Container, Button, Label } from '../library'
import { List, AddListModal, AddProduct, EditDeleteProduct, BuyProduct, FilterProducts  } from '../components'

import { retrieveUser, retrieveList, closeList } from '../../logic'

import './Home.css'

import { DEFAULT_AVATAR_URL } from '../../constants'

export default function HomeList() {
    console.log('Home -> render')
 
    const { alert, freeze, unfreeze, navigate } = useAppContext()

    const [user, setUser] = useState()
    const [list, setList] = useState()
    const [view, setView] = useState('list')
    const [modal, setModal] = useState(null)
    const [productId, setProductId] = useState(null)
    const [filterList, setFilterList] = useState({})
    const [lastUpdate, setLastUpdate] = useState(null)
    

    useEffect(() => {
        ;(async () => {
            try{     
                freeze()     
                const [user, list] = await Promise.all([retrieveUser(), retrieveList()])
                unfreeze()

                setUser(user)
                setList(list)
            } 
            catch (error) {
                unfreeze()
                alert(error.message)
            }
        })()
    }, [])

    const handleGoToHome = () => {
        closeList()

        navigate('/')
    }

    const handleCloseModal = () => {
        setModal(null)
        setLastUpdate(Date.now())
    }

    const handleCloseFilterModal = (filter) => {
        setModal(null)
        setFilterList(filter)
        setLastUpdate(Date.now())
    }

    const handleOpenAddProduct = (id) => {
        setProductId(id)
        setView('add-product')
    }

    const handleOpenEditDeleteProduct = (id) => {
        setProductId(id)
        setView('editDelete-product')
    }

    const handleOpenBuyProduct = (id) => {
        setProductId(id)
        setView('buy-product')
    }

    const handleOpenFilterProducts = () => {
        setModal('filter-products')
    }

    const handleResetFilterModal = (filter) => {
        setModal(null)
        setModal('filter-products')
        setFilterList({})
    }

    const handleGoToList = () => setView('list') 

    return <>
        <Container className="home">
            <header className="home-header">
                <h1 className="title" onClick={handleGoToList}>List</h1>

                <nav className="home-header-nav"> 
                    {user && <>
                        <img className="home-header-avatar" src={user.avatar? user.avatar : DEFAULT_AVATAR_URL} alt=""/>
                        <Label type="text" name="name" placeholder="name">{user.name}</Label>
                    </>}

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
                </nav>
                <Button name = "home" onClick={handleGoToHome}>Home</Button>   
            </header>

            <Container tag="main">               
                {view === 'list' && <List
                    onModifiedList={handleGoToList}
                    onAddedProduct={handleOpenAddProduct}
                    onEditedDeletedProduct={handleOpenEditDeleteProduct}
                    onBuyedProduct={handleOpenBuyProduct}
                    onFilteredProducts={handleOpenFilterProducts}
                    filterList={filterList}
                    lastUpdate={lastUpdate}
                />} 

                {view === 'add-product' && <AddProduct             
                    onCancel={handleGoToList}  
                    onAddedPropduct={handleGoToList}     
                />}

                {view === 'editDelete-product' && <EditDeleteProduct 
                    onCancel={handleGoToList}
                    onModifiedProduct={handleGoToList}
                    productId={productId}
                />}

                {view === 'buy-product' && <BuyProduct 
                    onCancel={handleGoToList}
                    onBuyedProduct={handleGoToList}
                    productId={productId}
                />}

                {modal === 'filter-products' && <FilterProducts 
                    onCancel={handleCloseModal}
                    onModifiedFilter={handleCloseFilterModal}
                    onResetFilter={handleResetFilterModal}
                    filterList={filterList}
                />}

            </Container>          
        </Container>
    </>

}
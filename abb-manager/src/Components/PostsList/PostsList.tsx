// @flow
import * as React from 'react';
import { ApiBlogServices } from '../../Data/ApiBlogs';
import { IBlog, IBlogReponse } from '../../Data/interfaces';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Modal, Pagination } from '@mui/material';
import { modalStyle } from '../../Data/constants';
import { useAppDispatch, useAppSelector } from '../../Store/hooks'
import { saveCurrentPage } from '../../Store/counterSlice';


type Props = {

};
export const PostsList = (props: Props) => {
    const navigate = useNavigate();


    const [items, setItems] = React.useState<IBlogReponse>( {blogItems: [], total: 0 })

    const dispatch = useAppDispatch()

    const page = useAppSelector( state => state.counter.currentPage)
    //const [page, setPage] = React.useState(1)
    const [removedItemsCounter, setRemovedItemsCounter] = React.useState(0)
    const apiBlogServices = new ApiBlogServices()

    // For modal
    const [openModalDelete, setOpenModalDelete] = React.useState(false);
    const handleModalDeleteOpen = () => {
        setOpenModalDelete(true);
        setOperationDeleteResult('')
    }
    const handleModalDeleteClose = () => {
        setOpenModalDelete(false);
        setOperationDeleteResult('')
    }
    const [operationDeleteResult, setOperationDeleteResult] = React.useState<string>('')
    const [selectedID, setSelectedID] = React.useState(0)
    const [deleteButtonDisabled, setDeleteButtonDisabled] = React.useState(false)




    const loadItems = (page: number): void => {
        apiBlogServices.getBlogItems(page).then(res => {
            console.log('res', res)
            setItems(res)
        }).catch(err => {
            console.error(err)
        })

    }
    React.useEffect( () => {
        loadItems(page)
    }, [page, removedItemsCounter])

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        console.log(value);
        //s1tPage(value)
        dispatch( saveCurrentPage(value))
      };

    return (
        <div>
            <h1>The list of posts</h1>
            <div className='datatable'>
            {
                items.blogItems.map( x=> {
                    return (
                        <div key={`${x.title}-${x.id}`} className='datatableRow'>
                            <div className='clmn1'>{x.id}</div>
                            <div className='clmn2'>{x.title}</div>
                            <div className='clmn3'><Link to={`/dashboard/${x.id}`}>Edit</Link></div>
                            <div className='clmn4'>
                                <div onClick={ ()=> {
                                    handleModalDeleteOpen()
                                    setSelectedID(x.id)
                                }}>
                                Delete</div></div>
                        </div>
                    )

                })
            }
                <Pagination count={10} page={page}
                onChange={handleChange} />
            </div>

            <div>
                <Button variant='contained' color='primary' >
            <div className='clmn3'><Link to={`/dashboard/new`}>New</Link></div></Button>
            </div>

            <div>
                    <Modal
                        open={openModalDelete}
                        onClose={handleModalDeleteClose} >
                        <Box sx={modalStyle}>
                            {
                                operationDeleteResult === '' ?
                                <>Do you really want to delete?</> :
                                <>{operationDeleteResult}</>
                            }

                            <br />
                            <Button variant='contained' color='primary' onClick={() => {
                                handleModalDeleteClose()
                            }
                            }>Close</Button>&nbsp;
                            <Button variant='contained' color='warning'
                            disabled={deleteButtonDisabled}
                            onClick={() => {
                                setDeleteButtonDisabled(true)

                                apiBlogServices.deleteBlogItem(selectedID )
                                    .then(res => {
                                        setOperationDeleteResult(res.message)
                                        setRemovedItemsCounter(removedItemsCounter + 1)
                                        setTimeout(() => {
                                            handleModalDeleteClose()
                                            setOperationDeleteResult('')
                                            setDeleteButtonDisabled(false)
                                        }, 3000);
                                    })
                                    .catch( err => {
                                        setOperationDeleteResult(err.message)
                                        setDeleteButtonDisabled(false)
                                        //handleModalDeleteClose()
                                    })
                                //navigate(`/dashboard/${selectedID}`)
                            }}>Confirm delete {selectedID}</Button>

                        </Box>
                    </Modal>
                </div>

        </div>
    );
};
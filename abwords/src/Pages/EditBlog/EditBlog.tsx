// @flow
import * as React from 'react';
import { ApiBlogServices } from '../../Data/ApiBlogs';
import { emptyBlog, IBaseItem, IBlog } from '../../Data/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Fade, Grid2, MenuItem, Modal, Pagination, Popper, Select, SelectChangeEvent, styled, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ApiServices } from '../../Data/ApiServices';
import { modalStyle } from '../../Data/constants';
import './EditBlog.css'

type Props = {
    isNew?: boolean
};
export const EditBlog = (props: Props) => {

    //const files = [ 'BoardingCard_377613385_DTM_GDN.pdf', 'BoardingCard_377613384_DTM_GDN.pdf', 'BoardingCard_377613383_DTM_GDN.pdf' ]
    const navigate = useNavigate();
    const [item, setItem] = React.useState<IBlog>(emptyBlog)
    const [categories, setCategories] = React.useState<IBaseItem[]>([])
    const [isLockedButton, setIsLockButton] = React.useState(false)
// For modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [operationResult, setOperationResult] = React.useState<string>('')

// For Popper
    const [openPopper, setOpenPopper] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [fileToremove, setFileToremove] = React.useState<string>('');

    const apiBlogServices = new ApiBlogServices()
    const url = window.location.href
    const pathname = window.location.pathname;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    console.log(url, pathname, protocol, hostname)
    const { id } = useParams();
    const pId: number = parseInt(id ?? '0')
    const [uploadedFiles, setUploadedFiles] = React.useState<string[]>([])

    const handleRemoveImageClick = (event: React.MouseEvent<HTMLElement>, uf: string) => {
        setAnchorEl(event.currentTarget);
        setFileToremove(uf)
        setOpenPopper((previousOpen) => !previousOpen);
      };

    React.useEffect(() => {
        apiBlogServices.GetCategories().then(res => {
            setCategories(res)
        }).then(() => {

            if (!props.isNew) {
                apiBlogServices.getBlogItem(pId)
                    .then(res => {
                        console.log('res', res)
                        let files = []
                        try {
                            files = JSON.parse(res.imageUrl)
                        }
                        catch {
                            if(res.imageUrl !== '' && res.imageUrl) {
                                files.push(res.imageUrl)
                            }
                        }
                        console.log('files', files)
                        setUploadedFiles(files)
                        setItem(res)
                    }).catch(err => {
                        console.error(err)
                    })
            }
        })
    }, [])

    function changeCategory(event: SelectChangeEvent<string>, child: React.ReactNode): void {
        const newItem = { ...item }
        newItem.categoryId = parseInt(event.target.value)
        newItem.categoryName = categories.filter(x => x.id === parseInt(event.target.value))[0].name
        setItem(newItem)


    }
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });



    return (
        <div style={{ border: '#000 1px solid', background: '#E7E7E7',  padding: '10px' }}>
            <h1>The list of posts</h1>
            {id}

            <Grid2 container spacing={2}>

                <Grid2 size={12}>
                    <TextField value={item.title} variant='outlined'
                        label='Title'
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const newVal = { ...item }
                            newVal.title = event.currentTarget.value
                            setItem(newVal)
                        }} />
                </Grid2 >
                <Grid2 size={12}>
                    <TextField multiline value={item.preview}
                        label='Preview'
                        variant='outlined'
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const newVal = { ...item }
                            newVal.preview = event.currentTarget.value
                            setItem(newVal)
                        }}
                    />
                </Grid2>

                <Grid2 size={12}>
                    <TextField multiline maxRows={5} value={item.theText}
                        label='The text'
                        variant='outlined'
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const newVal = { ...item }
                            newVal.theText = event.currentTarget.value
                            setItem(newVal)
                        }}
                    />
                </Grid2>

                <Grid2 size={12}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={String(item.categoryId)}
                        label="Age"
                        defaultValue={String(item.categoryId)}
                        onChange={changeCategory}>
                        {
                            categories.map(c => {
                                return (
                                    <MenuItem key={`cat${c.id}`} value={c.id}>{c.name}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </Grid2>



            <Popper id={id} open={openPopper} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps}>
                        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                            Do you confirm the remove of the file?<br />
                            <Button onClick={() => setOpenPopper(false)}>No</Button>
                            <Button onClick={ ()=> {
console.log('anchorEl', anchorEl, fileToremove)
apiBlogServices.RemoveFile(fileToremove, item.id).then( res => {

    const newFiles = [...uploadedFiles].filter(x => x !== fileToremove)
    setUploadedFiles(newFiles)
    setOpenPopper(false)

})
                            }}>Yes {}</Button>
                        </Box>
                    </Fade>
                )}
            </Popper>
            <Grid2 size={12}>
                <Box className='fileContainer'>
                    <h3>Uploaded files</h3>
                        {
                            uploadedFiles.map(uf => {
                                return (
                                <div className='item' key={`uf${uf}`}>
                                    <div><a href={`/${uf}`}>{uf}</a></div>
                                    <div role='button' className='btnRemove' key={uf} onClick={
                                        ( event: React.MouseEvent<HTMLElement>) => {
                                            handleRemoveImageClick(event, uf)
                                    }}>X</div>
                                </div>
                                    )
                            })
                        }
                    </Box>
                    {/* <TextField multiline value={item.imageUrl}
                        label='Image'
                        variant='outlined'
                    /> */}

                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload files
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const files = event.target.files;
                                console.log(files)
                                const newFiles: string[] = [...uploadedFiles]
                                if (files && files.length > 0) {
                                    Array.from(files).forEach(async (file: File) => {
                                        const uplFile = await apiBlogServices.UploadFile(file)
                                        console.log({ uplFile })
                                        if (uplFile !== '') newFiles.push(uplFile)
                                        setUploadedFiles(newFiles)
                                    });
                                }
                            }}
                            multiple
                        />
                    </Button>

                </Grid2>


                <Grid2 size={3}>
                    <Button variant='contained' color='secondary'
                    onClick={ () => navigate('/dashboard') } >Back</Button>
                </Grid2>
                <Grid2 size={9}>
                    <Button variant='contained'
                        disabled={isLockedButton}
                        onClick={async () => {
                            setIsLockButton(true)
                            handleOpen();
                            console.log('item', item)
                            item.imageUrl = JSON.stringify(uploadedFiles)
                            apiBlogServices.SavePost(item)
                                .then(res => {
                                    const newItem:IBlog = {...item}
                                    newItem.id = parseInt(res.toString())

                                    setItem(newItem)
                                    setOperationResult('Post saved')
                                    console.log('new upd', res)

                                        apiBlogServices.MoveFiles(parseInt(res), uploadedFiles)
                                        setOperationResult(operationResult + ',' + res.toString())

                                    setIsLockButton(false)
                                }).catch(err => {
                                    setOperationResult('Post not saved')
                                    console.error('error on moving fotos')
                                    setIsLockButton(false)
                                })
                        }}
                        title='Submit'
                    >Submit</Button>
                </Grid2>


                <div>
                    <Modal
                        open={open}
                        onClose={handleClose} >
                        <Box sx={modalStyle}>test
                            {operationResult}
                            <br />
                            <Button variant='contained' color='primary' onClick={() => {
                                handleClose()
                                navigate(`/dashboard/`)
                            }
                            }>Close</Button>&nbsp;
                            <Button variant='contained' color='success' onClick={() => {
                                navigate(`/dashboard/${item.id}`)
                                handleClose()
                            }}>Save & continue editing {item.id}</Button>

                        </Box>
                    </Modal>
                </div>
            </Grid2>
        </div>
    );
};
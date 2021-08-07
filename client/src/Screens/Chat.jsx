/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import {
    Button,
    CloseButton,
    Col,
    Container,
    Form,
    FormControl,
    InputGroup,
    Modal,
    Nav,
    Navbar,
    NavDropdown,
    Row,
} from 'react-bootstrap';
import SearchIcon from '@material-ui/icons/Search';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import {
    Avatar,
    Card,
    Badge,
    IconButton,
    CardMedia,
    Input,
    MenuItem,
    ListItemIcon,
    Divider,
    Menu,
} from '@material-ui/core';
import moment from 'moment';
import { io } from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { v4 as uuidv4 } from 'uuid';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SendIcon from '@material-ui/icons/Send';
import AttachmentIcon from '@material-ui/icons/Attachment';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import CopyrightIcon from '@material-ui/icons/Copyright';
import CancelIcon from '@material-ui/icons/Cancel';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Settings from '@material-ui/icons/Settings';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { userLogout, userUpdate } from '../Redux/Actons';
import Messages from '../Components/Messages';
import Users from '../Components/Users';
import UploadPreview from '../Components/UploadPreview';

const Chat = () => {
    const { user } = useSelector((state) => state.userLogin);
    const dispatch = useDispatch();
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const { addToast } = useToasts();
    const [roomUser, setRoomUser] = useState({});
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState('');
    const [images, setImages] = useState([]);
    const [show, setShow] = useState(false);
    const [roomUserPicShow, setRoomUserPicShow] = useState(false);
    const [replyMsgDetails, setReplyMsgDetails] = useState({});
    const [editMsgId, setEditMsgId] = useState('');
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [displayMessages, setDisplayMessages] = useState(false);
    const heightRef = useRef(0);
    const footerRef = useRef(0);
    const chatTextHeightRef = useRef(0);
    const textAreaRef = useRef(null);
    const audio = new Audio('/msg_sound.mp3');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // const socket = io('/');
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('/');
        socket.current.on('user-joined', (userData) => {
            const othersData = userData.allUsers.filter(
                (userInfo) => userInfo.email !== user.email
            );
            setUsers(othersData);
            if (
                userData.joinedUser &&
                userData.joinedUser.email !== user.email &&
                user?.isLoggedIn
            ) {
                addToast(`${userData.joinedUser.name} is active`, {
                    appearance: 'info',
                    autoDismiss: true,
                });

                if (roomUser !== null && roomUser.email === userData.joinedUser.email) {
                    setRoomUser(userData.joinedUser);
                }
            } else if (
                userData.leavingUser &&
                userData.leavingUser.email !== user.email &&
                user?.isLoggedIn
            ) {
                setRoomUser(userData.leavingUser);
            }
        });

        socket.current.on('chat-message', (chat) => {
            audio.play();
            setMessages((prevMsg) => [...prevMsg, chat]);
        });

        socket.current.on('removeMsgFromChat', async (data) => {
            try {
                const { data: msg } = await axios.get('/api/v1/messages');
                setMessages(msg.messages);
            } catch (error) {
                console.log(error);
            }
        });

        socket.current.emit('user-login', user);

        try {
            const getMessage = async () => {
                const { data } = await axios.get('/api/v1/messages');
                setMessages(data.messages);
            };
            getMessage();
        } catch (error) {
            console.log(error);
        }

        if (!user && !user?.isLoggedIn) {
            history.push('/');
        }

        if (window.innerWidth < 991) {
            setShowMobileChat(true);
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth < 991) {
                setShowMobileChat(true);
            }
        });

        replyMsgDetails !== null && replyMsgDetails.message ? textAreaRef.current.focus() : null;

        return () => {
            socket.current.off('user-joined', (data) => {});
            socket.current.off('room-user-details', (userData) => {});
            socket.current.off('chat-message', (chat) => {});
            socket.current.off('removeMsgFromChat', (data) => {});
            window.removeEventListener('resize', () => {});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addToast, user, search, replyMsgDetails]);

    const findRoomUser = (email) => {
        setRoomUser(users.filter((userInfo) => userInfo.email === email)[0]);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const chat = {
            _id: editMsgId,
            user: user._id,
            from: user.email,
            file: images,
            repliedOf: replyMsgDetails.message ?? '',
            to: roomUser.email,
            message,
            sendAt: Date.now(),
        };
        if ((message && e.key === 'Enter') || message) {
            setMessage('');
            try {
                const { data } = await axios.post('/api/v1/messages', chat);
                setMessages([...messages, data.message]);
                socket.current.emit('message', data.message);
                setShow(false);
                setImages([]);
                setReplyMsgDetails({});
                setEditMsgId('');
            } catch (error) {
                console.log(error);
            }
        } else {
            addToast('Please Write something', {
                appearance: 'info',
                autoDismiss: true,
            });
        }
    };

    const uploadFile = async (e) => {
        const { files } = e.target;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('uploads', files[i]);
        }

        try {
            const { data } = await axios.post('/api/v1/upload', formData);
            data.map((image) => setImages((preImage) => [...preImage, image.filePath]));
            data.length ? setShow(true) : setShow(false);
        } catch (error) {
            console.log(error.response);
        }
    };

    const removeFile = async (id) => {
        const uploadId = id.split('/uploads/')[1];
        await axios.delete(`/api/v1/upload/${uploadId}`);
        setImages(images.filter((singleImage) => singleImage !== id));
        images.length === 1 ? setShow(false) : setShow(true);
    };

    const onCloseRemoveImages = () => {
        if (images.length) {
            images.map((image) => removeFile(image));
            if (images.length - 1 > 0) {
                addToast(`Remove ${images.length - 1} files`, {
                    autoDismiss: true,
                    appearance: 'info',
                });
            }
        }
        if (!images.length) {
            setShow(!show);
        }
    };

    const deleteMsg = (id) => {
        socket.current.emit('messageDelete', id);
    };
    const editMsg = (id) => {
        setEditMsgId(id);
        setMessages(messages.filter((findMsg) => findMsg._id !== id));
        setMessage(messages.filter((findMsg) => findMsg._id === id)[0].message);
    };

    const replyMsg = (id) => {
        setReplyMsgDetails(messages.filter((findMsg) => findMsg._id === id)[0]);
    };

    return (
        <div>
            <Navbar bg="dark" className="nav__bar" ref={heightRef} expand="lg">
                <Container fluid={('xs', 'sm', 'md', 'lg')}>
                    <Link to="/">
                        <Navbar.Brand className="text-white align-items-center">
                            <img
                                className="app__logo me-2"
                                height="30px"
                                src="/logo.gif"
                                alt="logo"
                            />
                            <span className="h4">Chat-Buddy</span>
                        </Navbar.Brand>
                    </Link>
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link className="text-white fs-5">
                            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                                <Avatar
                                    style={{ width: 32, height: 32 }}
                                    src={user.photo}
                                    alt={user.name}
                                />
                            </IconButton>
                        </Nav.Link>

                        {/* profile submenu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            style={{
                                marginTop: heightRef.current.offsetHeight - 15,
                            }}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem>
                                <Avatar
                                    src={user.photo}
                                    alt={user.name}
                                    style={{ width: 32, height: 32, marginRight: 28 }}
                                />{' '}
                                {user.name}
                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    dispatch(userLogout());
                                    socket.current.disconnect();
                                    history.push('/');
                                    localStorage.removeItem('roomUser');
                                }}
                            >
                                <ListItemIcon>
                                    <ExitToAppIcon fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Nav>
                </Container>
            </Navbar>

            <section className="bg__black">
                <Container fluid={('sm', 'md', 'lg')}>
                    <Row>
                        <Col
                            md={3}
                            xs={12}
                            style={{
                                height: `calc(100vh - ${
                                    heightRef.current.offsetHeight + footerRef.current.offsetHeight
                                }px)`,
                                backgroundColor: '#1c2834',
                            }}
                        >
                            <div className="search__bar">
                                <InputGroup className="py-3">
                                    <InputGroup.Text id="search" className="bg-white border-end-0">
                                        <SearchIcon />
                                    </InputGroup.Text>
                                    <FormControl
                                        className="border-start-0"
                                        placeholder="Username"
                                        aria-label="Username"
                                        aria-describedby="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        type="text"
                                    />
                                </InputGroup>
                            </div>
                            {users &&
                                users.map((userInfo) => (
                                    <Users
                                        userInfo={userInfo}
                                        messages={messages}
                                        findRoomUser={findRoomUser}
                                        key={userInfo.email}
                                        setReplyMsgDetails={setReplyMsgDetails}
                                        setDisplayMessages={setDisplayMessages}
                                        showMobileChat={showMobileChat}
                                    />
                                ))}
                        </Col>
                        <Col
                            md={9}
                            xs={12}
                            className={
                                showMobileChat
                                    ? 'bg-primary position-absolute top-0 end-0 bottom-0 start-0'
                                    : 'bg-primary'
                            }
                            style={{
                                display:
                                    showMobileChat && displayMessages
                                        ? 'block'
                                        : !showMobileChat
                                        ? 'block'
                                        : 'none',
                            }}
                        >
                            <main className="position-relative h-100">
                                {roomUser.email ? (
                                    <>
                                        <section
                                            className="message__header d-flex justify-content-between align-items-center py-4 px-2 border-bottom"
                                            id="user__head"
                                        >
                                            <div className="d-flex">
                                                <Avatar
                                                    alt={roomUser.name}
                                                    src={roomUser.photo}
                                                    style={{
                                                        height: 50,
                                                        width: 50,
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => setRoomUserPicShow(true)}
                                                />
                                                <div className="ps-3">
                                                    <h4 className="text-white my-0">
                                                        {roomUser.name}
                                                    </h4>
                                                    <p className="text-white my-0">
                                                        {roomUser.isActive
                                                            ? 'Online'
                                                            : `Last Seen ${moment(
                                                                  roomUser.updatedAt
                                                              ).calendar()}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <IconButton
                                                className="float-end mobile__back_btn"
                                                onClick={() => setDisplayMessages(false)}
                                            >
                                                <ArrowRightAltIcon className="text-white" />
                                            </IconButton>
                                        </section>
                                        <ScrollToBottom className="message__body overflow-auto position-relative">
                                            {messages &&
                                                messages.map((messageDetails) => (
                                                    <Messages
                                                        messageDetails={messageDetails}
                                                        user={user}
                                                        roomUser={roomUser}
                                                        removeFile={removeFile}
                                                        editMsg={editMsg}
                                                        deleteMsg={deleteMsg}
                                                        replyMsg={replyMsg}
                                                        key={messageDetails.id}
                                                    />
                                                ))}
                                        </ScrollToBottom>
                                        <section
                                            className="input__area position-absolute bottom-0 start-0 end-0"
                                            id="text__area"
                                        >
                                            <form onSubmit={sendMessage} className="mb-2">
                                                <Row>
                                                    {replyMsgDetails !== null &&
                                                        replyMsgDetails.message && (
                                                            <Col xs={10}>
                                                                <div className="px-3 py-2 bg-primary position-relative">
                                                                    <p className="mb-0 col-10 text-truncate text-white">
                                                                        <b>Replying to : </b>
                                                                        {
                                                                            replyMsgDetails.message
                                                                        }{' '}
                                                                        <IconButton
                                                                            className="position-absolute top-0 end-0"
                                                                            onClick={() =>
                                                                                setReplyMsgDetails(
                                                                                    ''
                                                                                )
                                                                            }
                                                                        >
                                                                            <CloseIcon className="text-white bg-dark rounded-circle" />
                                                                        </IconButton>
                                                                    </p>
                                                                </div>
                                                            </Col>
                                                        )}
                                                    <Col xs={10}>
                                                        <Form.Group
                                                            controlId="formBasicEmail"
                                                            ref={chatTextHeightRef}
                                                        >
                                                            <Form.Control
                                                                value={message}
                                                                onChange={(e) =>
                                                                    setMessage(e.target.value)
                                                                }
                                                                onKeyPress={(e) =>
                                                                    e.key === 'Enter'
                                                                        ? sendMessage(e)
                                                                        : setMessage(e.target.value)
                                                                }
                                                                ref={textAreaRef}
                                                                type="text"
                                                                as="textarea"
                                                                className="rounded text__input bg-primary text-white"
                                                                autoComplete="off"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={1}>
                                                        <div className="d-flex">
                                                            <label
                                                                htmlFor="icon-button-file"
                                                                className="float-end"
                                                            >
                                                                <Input
                                                                    id="icon-button-file"
                                                                    type="file"
                                                                    onChange={uploadFile}
                                                                    hidden
                                                                />
                                                                <IconButton
                                                                    aria-label="upload picture"
                                                                    component="span"
                                                                    className="border p-2 input__file__button"
                                                                >
                                                                    <AttachmentIcon className="attachments__icon text-dark" />
                                                                </IconButton>
                                                            </label>
                                                            <Button
                                                                variant="outline-secondary rounded-circle p-2 pl-3 shadow-lg float-start"
                                                                className="ms-2"
                                                                type="submit"
                                                            >
                                                                <SendIcon className="attachments__icon" />
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </form>
                                        </section>
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%,-50%)',
                                        }}
                                    >
                                        <h4 className="text-white">Please Select a conversation</h4>
                                    </div>
                                )}
                            </main>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* footer nav */}
            <Navbar style={{ background: '#000' }} className="nav__bar" ref={footerRef} expand="lg">
                <Container fluid={('sm', 'md')}>
                    <Nav className="me-auto align-items-center py-3 text-white">
                        Copyright <CopyrightIcon className="me-2" /> {new Date().getFullYear()}{' '}
                        e-Chat-Buddy. All rights reserved.
                    </Nav>
                    <Nav className="ms-auto align-items-center py-3 text-white">
                        Designed & Developed By Sazzad Bin Anwar
                    </Nav>
                </Container>
            </Navbar>

            {/* All modals */}
            {/* Modal for image upload */}
            <Modal
                show={show}
                onHide={() => setShow(!show)}
                fullscreen="md-down"
                centered
                backdrop="static"
                className="shadow-lg"
            >
                <Modal.Header>
                    <Modal.Title className="position-relative w-100">
                        Upload File{' '}
                        <IconButton
                            className="position-absolute top-0 end-0"
                            onClick={() => onCloseRemoveImages()}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row
                        style={{
                            maxHeight: 450,
                            overflowY: 'auto',
                        }}
                    >
                        {images &&
                            images.map((image) => (
                                <UploadPreview
                                    fileData={image}
                                    removeFile={removeFile}
                                    key={image}
                                />
                            ))}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onCloseRemoveImages()}>
                        Close
                    </Button>
                    <Button variant="outline-primary" onClick={sendMessage}>
                        <SendIcon className="fs-7" />
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* modal for picture view */}
            <Modal
                show={roomUserPicShow}
                onHide={() => setRoomUserPicShow(!roomUserPicShow)}
                fullscreen="md-down"
                centered
                className="shadow-lg w-100"
            >
                <img alt={roomUser.name} src={roomUser.photo} />
                <IconButton
                    className="position-absolute top-0 end-0"
                    onClick={() => setRoomUserPicShow(!roomUserPicShow)}
                >
                    <CloseIcon className="text-white bg-dark" />
                </IconButton>
            </Modal>
        </div>
    );
};

export default Chat;

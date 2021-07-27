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
import { Avatar, Card, Badge, IconButton, CardMedia } from '@material-ui/core';
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
    const heightRef = useRef(0);
    const footerRef = useRef(0);
    const audio = new Audio('/msg_sound.mp3');

    // const socket = io('/');
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('/');
        socket.current.on('user-joined', (userData) => {
            const othersData = userData.allUsers.filter(
                (userInfo) => userInfo.email !== user.email
            );
            if (
                userData.joinedUser &&
                userData.joinedUser.email !== user.email &&
                user?.isLoggedIn
            ) {
                addToast(`${userData.joinedUser.name} is active`, {
                    appearance: 'info',
                    autoDismiss: true,
                });
            } else if (
                userData.leavingUser &&
                userData.leavingUser.email !== user.email &&
                user?.isLoggedIn
            ) {
                setRoomUser(userData.leavingUser);
            }
            setUsers(othersData);
        });
        socket.current.on('room-user-details', (userData) => {
            setRoomUser(userData);
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
            console.log(messages);
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

        return () => {
            socket.current.off('user-joined', (data) => {});
            socket.current.off('room-user-details', (userData) => {});
            socket.current.off('chat-message', (chat) => {});
            socket.current.off('removeMsgFromChat', (data) => {});
            // socket.current.off('roomUser', (userData) => {});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addToast, user, search]);

    const findRoomUser = (email) => {
        setRoomUser(users.filter((userInfo) => userInfo.email === email)[0]);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const chat = {
            user: user._id,
            from: user.email,
            file: images,
            to: roomUser.email,
            message,
            sendAt: Date.now(),
        };
        if ((message && images) || images) {
            setMessage('');
            try {
                const { data } = await axios.post('/api/v1/messages', chat);
                setMessages([...messages, data.message]);
                socket.current.emit('message', data.message);
                setShow(false);
                setImages([]);
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
        } catch (error) {
            console.log(error.response);
        }
    };

    const removeFile = async (id) => {
        const uploadId = id.split('/uploads/')[1];
        await axios.delete(`/api/v1/upload/${uploadId}`);
        setImages(images.filter((singleImage) => singleImage !== id));
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
    const editMsg = (id) => {};

    const replyMsg = (id) => {
        setReplyMsgDetails(messages.find((findMsg) => findMsg._id === id));
    };

    return (
        <div>
            <Navbar bg="dark" className="nav__bar" ref={heightRef} expand="lg">
                <Container fluid={('xs', 'sm', 'md')}>
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
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link className="text-white fs-5">
                                <NavLink to="/">Home</NavLink>
                            </Nav.Link>
                            <Nav.Link className="text-white fs-5">{user.name}</Nav.Link>
                            <Nav.Link className="text-white fs-5">{user.email}</Nav.Link>
                            <Nav.Link className="text-white">
                                <IconButton
                                    className="fs-7"
                                    onClick={() => {
                                        dispatch(userLogout());
                                        socket.current.disconnect();
                                        history.push('/');
                                    }}
                                >
                                    <ExitToAppIcon className="text-white" />
                                    <span className="logout">Logout</span>{' '}
                                </IconButton>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <section className="bg__black">
                <Container fluid={('sm', 'md', 'lg')}>
                    <Row>
                        <Col
                            md={3}
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
                                    />
                                ))}
                        </Col>
                        <Col md={9} className="bg-primary">
                            <main className="position-relative h-100">
                                {roomUser.name ? (
                                    <>
                                        <section
                                            className="message__header d-flex align-items-center py-4 px-2 border-bottom"
                                            id="user__head"
                                        >
                                            <Avatar
                                                alt={roomUser.name}
                                                src={roomUser.photo}
                                                style={{ height: 50, width: 50, cursor: 'pointer' }}
                                                onClick={() => setRoomUserPicShow(true)}
                                            />
                                            <div className="ps-3">
                                                <h4 className="text-white my-0">{roomUser.name}</h4>
                                                <p className="text-white my-0">
                                                    {roomUser.isActive
                                                        ? 'Online'
                                                        : `Last Seen ${moment(
                                                              roomUser.updatedAt
                                                          ).calendar()}`}
                                                </p>
                                            </div>
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
                                            <form
                                                onSubmit={sendMessage}
                                                className="d-flex justify-content-center align-items-center mb-2"
                                            >
                                                <Form.Group
                                                    className="w-100"
                                                    controlId="exampleForm.ControlTextarea1"
                                                >
                                                    <Form.Control
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        as="textarea"
                                                        row={1}
                                                    />
                                                </Form.Group>

                                                <Button
                                                    variant="outline-secondary rounded-circle p-2 pl-3"
                                                    className="ms-2"
                                                    onClick={() => setShow(!show)}
                                                >
                                                    <AttachmentIcon className="fs-7" />
                                                </Button>
                                                <Button
                                                    variant="outline-secondary rounded-circle p-2 pl-3 shadow-lg"
                                                    className="ms-2"
                                                    type="submit"
                                                >
                                                    <SendIcon className="fs-7" />
                                                </Button>
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
            <Navbar
                style={{ background: '#000' }}
                className="nav__bar "
                ref={footerRef}
                expand="lg"
            >
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
                    <Form.Group className="mb-3" controlId="photo">
                        <Form.Label className="text-black">Upload Your file</Form.Label>
                        <div className="input-group mb-3">
                            <input
                                type="file"
                                className="form-control"
                                onChange={uploadFile}
                                placeholder="Input Photos"
                                id="inputGroupFile02"
                                multiple
                            />
                        </div>
                    </Form.Group>
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
                    className="position-absolute top-0 end-0 bg-dark"
                    onClick={() => setRoomUserPicShow(!roomUserPicShow)}
                >
                    <CloseIcon className="text-white" />
                </IconButton>
            </Modal>
        </div>
    );
};

export default Chat;

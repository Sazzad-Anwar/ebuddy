/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import {
    Button,
    Col,
    Container,
    Form,
    FormControl,
    InputGroup,
    Nav,
    Navbar,
    NavDropdown,
    Row,
} from 'react-bootstrap';
import SearchIcon from '@material-ui/icons/Search';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { Avatar, Card, Badge, IconButton } from '@material-ui/core';
import moment from 'moment';
import { io } from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { v4 as uuidv4 } from 'uuid';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { userLogout, userUpdate } from '../Redux/Actons';

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
    const [userDetailsUpdate, setUserDetailsUpdate] = useState();

    // const socket = io('/');
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('/');
        socket.current.on('user-joined', (userData) => {
            const othersData = userData.allUsers.filter(
                (userInfo) => userInfo.email !== user.email
            );
            console.log(userData.joinedUser);
            if (
                userData.joinedUser &&
                userData.joinedUser.email !== user.email &&
                user.isLoggedIn
            ) {
                addToast(`${userData.joinedUser.name} is active`, {
                    appearance: 'info',
                    autoDismiss: true,
                });
            } else if (
                userData.leavingUser &&
                userData.leavingUser.email !== user.email &&
                user.isLoggedIn
            ) {
                addToast(`${userData.leavingUser.name} has left`, {
                    appearance: 'info',
                    autoDismiss: true,
                });
                setRoomUser({});
            }
            setUsers(othersData);
        });
        socket.current.on('room-user-details', (userData) => {
            setRoomUser(userData);
        });
        // socket.current.on('roomUser', (userData) => {
        //     setRoomUser(userData);
        // });
        socket.current.on('chat-message', (chat) => {
            setMessages((prevMessages) => [...prevMessages, chat]);
        });
        socket.current.emit('user-login', user);

        // dispatch(userUpdate(userDetailsUpdate));

        return () => {
            socket.current.off('user-joined', (data) => {});
            socket.current.off('room-user-details', (userData) => {});
            socket.current.off('chat-message', (chat) => {});
            // socket.current.off('roomUser', (userData) => {});
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addToast, user, search]);

    const findRoomUser = (email) => {
        setRoomUser(users.filter((userInfo) => userInfo.email === email)[0]);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        const chat = {
            user: user._id,
            from: user.email,
            file: '',
            to: roomUser.email,
            message,
            sendAt: Date.now(),
        };
        if (message) {
            // setMessages([...messages, chat]);
            setMessage('');
            socket.current.emit('message', chat);
            setMessages((prevMessages) => [...prevMessages, chat]);
        } else {
            addToast('Please Write something', {
                appearance: 'info',
                autoDismiss: true,
            });
        }
    };

    return (
        <div>
            <Navbar bg="dark" expand="lg">
                <Container>
                    <Link to="/">
                        <Navbar.Brand className="text-white">
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
                        <Nav className="ms-auto">
                            <Nav.Link className="text-white">
                                <NavLink to="/">Home</NavLink>
                            </Nav.Link>
                            <Nav.Link className="text-white">{user.name}</Nav.Link>
                            <Nav.Link className="text-white">{user.email}</Nav.Link>
                            <IconButton
                                className="fs-7"
                                onClick={() => {
                                    dispatch(userLogout());
                                    socket.current.disconnect();
                                    history.push('/');
                                }}
                            >
                                <ExitToAppIcon className="text-white" />
                            </IconButton>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container fluid="lg">
                <Row>
                    <Col
                        md={3}
                        style={{ height: 'calc(100vh - 72px)', backgroundColor: '#1c2834' }}
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
                                <Card
                                    body
                                    className={
                                        userInfo.isActive
                                            ? 'bg-success p-2 d-flex align-items-center mb-3'
                                            : 'bg-dark p-2 d-flex align-items-center mb-3'
                                    }
                                    key={userInfo.email}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        findRoomUser(userInfo.email);
                                    }}
                                >
                                    <Badge
                                        badgeContent={
                                            userInfo.isActive
                                                ? messages.filter(
                                                      (userMessage) =>
                                                          userMessage.from === userInfo.email
                                                  ).length
                                                : 0
                                        }
                                        color="primary"
                                    >
                                        <Avatar
                                            alt={userInfo.name}
                                            src={userInfo.photo}
                                            className="shadow-lg border"
                                        />
                                    </Badge>

                                    <div className="ps-3 ">
                                        <h5 className="text-white my-0">{userInfo.name}</h5>
                                        <p className="text-white my-0">
                                            {userInfo.isActive
                                                ? 'Active Now'
                                                : `Active ${moment(userInfo.updatedAt).fromNow()}`}
                                            {}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        {/* <Card body className="bg-dark p-2 d-flex align-items-center my-2">
                            <Avatar alt="Sazzad" src="https://picsum.photos/200" />
                            <div className="ps-3 ">
                                <h5 className="text-white my-0">Sazzad</h5>
                                <p className="text-white my-0">{moment().fromNow()}</p>
                            </div>
                        </Card> */}
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
                                            style={{ height: 50, width: 50 }}
                                        />
                                        <div className="ps-3">
                                            <h4 className="text-white my-0">{roomUser.name}</h4>
                                            <p className="text-white my-0">
                                                {roomUser.isActive
                                                    ? 'Active now'
                                                    : `Active ${moment(
                                                          roomUser.updatedAt
                                                      ).fromNow()}`}
                                            </p>
                                        </div>
                                    </section>
                                    <ScrollToBottom
                                        className="message__body overflow-auto position-relative"
                                        // style={{
                                        //     height: `calc(100vh - (${
                                        //         userHeadHeight + textAreaHeight + 75
                                        //     }px))`,
                                        // }}
                                    >
                                        {messages &&
                                            messages.map((messageDetails) => {
                                                if (
                                                    user.email !== messageDetails.from &&
                                                    roomUser.email === messageDetails.from &&
                                                    user.email === messageDetails.to
                                                ) {
                                                    return (
                                                        <div
                                                            className="d-flex my-3 chat__buddy"
                                                            style={{ marginRight: '20%' }}
                                                            key={messageDetails.id}
                                                        >
                                                            <Avatar
                                                                alt={messageDetails.name}
                                                                src={messageDetails.photo}
                                                            />
                                                            <div>
                                                                <Card
                                                                    body
                                                                    className="chat__card chat__person ms-3 p-2"
                                                                    style={{ width: '100%' }}
                                                                >
                                                                    {messageDetails.message}
                                                                </Card>
                                                                <p className="text-white ms-3">
                                                                    {moment().fromNow(
                                                                        messageDetails.sendAt
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (
                                                    user.email === messageDetails.from &&
                                                    roomUser.email === messageDetails.to
                                                ) {
                                                    return (
                                                        <div
                                                            className="d-flex flex-column justify-content-end align-items-end my-3"
                                                            style={{ marginLeft: '20%' }}
                                                            key={messageDetails.id}
                                                        >
                                                            <div className="d-flex my__chat text-right justify-content-end">
                                                                <Card
                                                                    body
                                                                    className="chat__card chat__person me-3 p-2"
                                                                    style={{ width: '100%' }}
                                                                >
                                                                    {messageDetails.message}
                                                                </Card>
                                                                <Avatar
                                                                    alt={messageDetails.name}
                                                                    src={messageDetails.photo}
                                                                />
                                                            </div>
                                                            <p className="text-white me-5">
                                                                {moment(
                                                                    messageDetails.sendAt
                                                                ).fromNow()}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                if (roomUser.email !== messageDetails.to) {
                                                    return null;
                                                }
                                                return null;
                                            })}
                                    </ScrollToBottom>
                                    <section
                                        className="input__area position-absolute bottom-0 start-0 end-0"
                                        id="text__area"
                                    >
                                        <form
                                            onSubmit={sendMessage}
                                            className="d-flex justify-content-center align-items-start"
                                        >
                                            <Form.Group
                                                className="mb-3 w-100"
                                                controlId="exampleForm.ControlTextarea1"
                                            >
                                                <Form.Control
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    as="textarea"
                                                    rows={3}
                                                />
                                            </Form.Group>
                                            <Button
                                                variant="outline-secondary"
                                                className="ms-2"
                                                type="submit"
                                            >
                                                Send
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
        </div>
    );
};

export default Chat;

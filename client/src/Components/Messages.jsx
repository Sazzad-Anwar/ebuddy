/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
import { Avatar, Card, IconButton, Menu, MenuItem } from '@material-ui/core';
import { ReactTinyLink } from 'react-tiny-link';
import moment from 'moment';
import { Col, Modal, Popover, Row } from 'react-bootstrap';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ReplyIcon from '@material-ui/icons/Reply';
import MessageContainingFile from './MessageContainingFile';

const Messages = ({ messageDetails, user, roomUser, editMsg, deleteMsg, replyMsg }) => {
    const [show, setShow] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [chatImage, setChatImage] = useState('');
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    if (
        user.email !== messageDetails.from &&
        roomUser.email === messageDetails.from &&
        user.email === messageDetails.to
    ) {
        return (
            <div className="d-flex my-3 chat__buddy" style={{ marginRight: '20%' }}>
                <Avatar
                    alt={roomUser.name}
                    src={roomUser.photo}
                    style={{ width: 32, height: 32 }}
                />
                <div className="d-flex flex-column align-items-start">
                    <div className="d-flex">
                        {messageDetails.message && (
                            <div className="chat__card chat__person ms-0 p-2">
                                {messageDetails.repliedOf && (
                                    <Card
                                        body
                                        className="chat__card chat__person p-2 chat__reply text-white rounded-top"
                                    >
                                        {`${
                                            messageDetails.repliedOf.length > 200
                                                ? messageDetails.repliedOf.substring(0, 200)
                                                : messageDetails.repliedOf
                                        }...`}{' '}
                                        <ReplyIcon />
                                    </Card>
                                )}

                                <Card
                                    body
                                    className="chat__card chat__person p-2"
                                    style={{ width: '100%' }}
                                >
                                    {messageDetails.message.startsWith('http') ? (
                                        <ReactTinyLink
                                            cardSize="small"
                                            showGraphic={true}
                                            maxLine={2}
                                            minLine={1}
                                            proxyUrl="https://corsanywhere.herokuapp.com"
                                            url={messageDetails.message}
                                        />
                                    ) : (
                                        messageDetails.message
                                    )}
                                </Card>
                            </div>
                        )}

                        {messageDetails.file && (
                            <Row className="ms-2">
                                {messageDetails.file.map((fileData) => (
                                    <MessageContainingFile
                                        fileData={fileData}
                                        setShow={setShow}
                                        setChatImage={setChatImage}
                                        key={fileData}
                                    />
                                ))}
                            </Row>
                        )}

                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            className="ms-2"
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: 48 * 4.5,
                                },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    replyMsg(messageDetails._id);
                                }}
                            >
                                <ReplyIcon />
                            </MenuItem>
                        </Menu>
                    </div>

                    <p className="text-white ms-2 mt-0 pt-0 last__seen">
                        {moment(messageDetails.updatedAt).fromNow()}
                    </p>
                </div>
            </div>
        );
    }
    if (user.email === messageDetails.from && roomUser.email === messageDetails.to) {
        return (
            <div
                className="d-flex flex-column justify-content-end align-items-end my-3"
                style={{ marginLeft: '20%' }}
            >
                <div className="d-flex my__chat text-right justify-content-end">
                    <div className="chat__card me-3 d-flex justify-content-center align-items-center">
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            className="me-3"
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: 48 * 4.5,
                                    // width: '20ch',
                                },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    deleteMsg(messageDetails._id);
                                }}
                            >
                                <DeleteIcon />
                            </MenuItem>
                            {messageDetails.message && (
                                <MenuItem
                                    onClick={() => {
                                        handleClose();
                                        editMsg(messageDetails._id);
                                    }}
                                >
                                    <EditIcon />
                                </MenuItem>
                            )}

                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    replyMsg(messageDetails._id);
                                }}
                            >
                                <ReplyIcon />
                            </MenuItem>
                        </Menu>

                        <div className="d-flex flex-column justify-content-end align-items-center">
                            {messageDetails.message && (
                                <div className="chat__person p-2">
                                    {messageDetails.repliedOf && (
                                        <Card
                                            body
                                            className="chat__person p-2 chat__reply text-white"
                                        >
                                            {`${messageDetails.repliedOf.substring(0, 200)}...`}{' '}
                                            <ReplyIcon />
                                        </Card>
                                    )}
                                    <Card
                                        body
                                        className="chat__person p-2"
                                        style={{ width: '100%' }}
                                    >
                                        {messageDetails.message.startsWith('http') ? (
                                            <ReactTinyLink
                                                cardSize="small"
                                                showGraphic={true}
                                                maxLine={2}
                                                minLine={1}
                                                proxyUrl="https://corsanywhere.herokuapp.com"
                                                url={messageDetails.message}
                                            />
                                        ) : (
                                            messageDetails.message
                                        )}
                                    </Card>
                                </div>
                            )}
                            {messageDetails.file && (
                                <Row>
                                    {messageDetails.file.map((fileData) => (
                                        <MessageContainingFile
                                            fileData={fileData}
                                            setShow={setShow}
                                            setChatImage={setChatImage}
                                            key={fileData}
                                            fileLength={messageDetails.file.length}
                                        />
                                    ))}
                                </Row>
                            )}
                        </div>
                    </div>

                    <Avatar
                        alt={user.name}
                        src={user.photo}
                        style={{ width: 32, height: 32, marginRight: 10 }}
                    />
                </div>
                <p className="text-white mt-1 mb-0 me-3 pe-5 last__seen">
                    {messageDetails.isSeen && <i className="me-1">seen</i>}
                    {moment(messageDetails.updatedAt).fromNow()}
                </p>

                {/* modal for picture view */}
                <Modal
                    show={show}
                    onHide={() => setShow(!show)}
                    fullscreen="md-down"
                    centered
                    className="shadow-lg w-100"
                >
                    <img alt={chatImage} src={chatImage} />
                    <CloseIcon
                        className="bg-white rounded-circle position-absolute"
                        style={{
                            top: '-10px',
                            right: '-10px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setShow(!show)}
                    />
                </Modal>
            </div>
        );
    }
    if (roomUser.email !== messageDetails.to) {
        return null;
    }
    return null;
};

export default Messages;

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
import GetAppIcon from '@material-ui/icons/GetApp';
import FileSaver from 'file-saver';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import path from 'path';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ReplyIcon from '@material-ui/icons/Reply';
import { host } from '../Config.json';

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

    console.log(show);

    if (
        user.email !== messageDetails.from &&
        roomUser.email === messageDetails.from &&
        user.email === messageDetails.to
    ) {
        return (
            <div className="d-flex my-3 chat__buddy" style={{ marginRight: '20%' }}>
                <Avatar alt={roomUser.name} src={roomUser.photo} />
                <div>
                    {messageDetails.message && (
                        <Card
                            body
                            className="chat__card chat__person ms-3 p-2"
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
                    )}
                    {messageDetails.file && (
                        <Row>
                            {messageDetails.file.map((fileData) => {
                                if (
                                    path.extname(fileData) === '.png' ||
                                    path.extname(fileData) === '.jpg' ||
                                    path.extname(fileData) === '.jpeg' ||
                                    path.extname(fileData) === '.gif'
                                ) {
                                    return (
                                        <Col xs={12} md={4} className="g-2" key={fileData}>
                                            <Card
                                                elevation={5}
                                                className="mb-0 ms-3 p-2 img__card"
                                                style={{
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    height: 200,
                                                    width: 200,
                                                }}
                                            >
                                                <img
                                                    src={fileData}
                                                    height={200}
                                                    width={200}
                                                    className="position-absolute"
                                                    alt={`upload-${fileData}`}
                                                    style={{
                                                        right: 0,
                                                        top: 0,
                                                        bottom: 0,
                                                        left: 0,
                                                    }}
                                                />
                                                <div className="position-absolute start-0 top-0 end-0 bottom-0 download__btn">
                                                    <GetAppIcon
                                                        className="bg-white rounded-circle position-absolute"
                                                        style={{
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%,-50%)',
                                                            cursor: 'pointer',
                                                            zIndex: 1,
                                                        }}
                                                        onClick={() =>
                                                            FileSaver.saveAs(
                                                                `${host}${fileData}`,
                                                                `image.${path.extname(fileData)}`
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="position-absolute start-0 top-0 end-0 bottom-0 download__btn">
                                                    <ZoomInIcon
                                                        className="bg-white rounded-circle position-absolute"
                                                        style={{
                                                            top: 0,
                                                            right: 0,
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            setShow(true);
                                                            setChatImage(fileData);
                                                        }}
                                                    />
                                                </div>
                                            </Card>
                                        </Col>
                                    );
                                }

                                if (
                                    path.extname(fileData) === '.mp4' ||
                                    path.extname(fileData) === '.mov' ||
                                    path.extname(fileData) === '.wmv' ||
                                    path.extname(fileData) === '.flv' ||
                                    path.extname(fileData) === '.webm' ||
                                    path.extname(fileData) === '.mkv'
                                ) {
                                    return (
                                        <Col xs={12} className="g-2" key={fileData}>
                                            <Card
                                                elevation={5}
                                                className="mb-0 ms-3 p-2 img__card"
                                                style={{
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    height: 400,
                                                    width: 400,
                                                }}
                                            >
                                                <video controls width="100%" height="400">
                                                    <source
                                                        src={fileData}
                                                        type={`video/${
                                                            path.extname(fileData).split('.')[1]
                                                        }`}
                                                    />
                                                </video>
                                            </Card>
                                        </Col>
                                    );
                                }
                                if (
                                    path.extname(fileData) === '.mp3' ||
                                    path.extname(fileData) === '.ogg' ||
                                    path.extname(fileData) === '.mpeg'
                                ) {
                                    return (
                                        <Col xs={12} className="g-2" key={fileData}>
                                            <audio controls>
                                                <source
                                                    src={fileData}
                                                    type={`audio/${
                                                        path.extname(fileData).split('.')[1]
                                                    }`}
                                                />
                                            </audio>
                                        </Col>
                                    );
                                }
                                return (
                                    <Col xs={12} className="g-2" key={fileData}>
                                        <Card
                                            elevation={5}
                                            className="mb-0 ms-3 py-1 px-2 rounded"
                                            style={{
                                                backgroundColor: '#616161',
                                            }}
                                        >
                                            <div
                                                className="d-flex justify-content-between align-items-center"
                                                style={{ width: 200 }}
                                            >
                                                <InsertDriveFileIcon className="text-white" />
                                                <span className="col-4 text-truncate text-white">
                                                    {fileData.split('/')[2]}
                                                </span>
                                                <span className="text-white">
                                                    {path.extname(fileData)}
                                                </span>
                                                <IconButton>
                                                    <GetAppIcon
                                                        className="text-white"
                                                        onClick={() =>
                                                            FileSaver.saveAs(
                                                                `${host}${fileData}`,
                                                                `file.${path.extname(fileData)}`
                                                            )
                                                        }
                                                    />
                                                </IconButton>
                                            </div>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                    <p className="text-white ms-3 mt-1 last__seen">
                        {moment(messageDetails.sendAt).fromNow()}
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

                        {messageDetails.message && (
                            <Card body className="chat__person me-3 p-2" style={{ width: '100%' }}>
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
                        )}
                        {messageDetails.file && (
                            <Row>
                                {messageDetails.file.map((fileData) => {
                                    if (
                                        path.extname(fileData) === '.png' ||
                                        path.extname(fileData) === '.jpg' ||
                                        path.extname(fileData) === '.jpeg' ||
                                        path.extname(fileData) === '.gif'
                                    ) {
                                        return (
                                            <Col xs={12} md={4} className="g-2" key={fileData}>
                                                <Card
                                                    elevation={5}
                                                    className="mb-0 img__card"
                                                    style={{
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        height: 200,
                                                        width: 200,
                                                    }}
                                                >
                                                    <img
                                                        src={fileData}
                                                        height={200}
                                                        width={200}
                                                        className="position-absolute"
                                                        alt={`upload-${fileData}`}
                                                        style={{
                                                            right: 0,
                                                            top: 0,
                                                            bottom: 0,
                                                            left: 0,
                                                        }}
                                                    />
                                                    <div className="position-absolute start-0 top-0 end-0 bottom-0 download__btn">
                                                        <GetAppIcon
                                                            className="bg-white rounded-circle position-absolute"
                                                            style={{
                                                                top: '50%',
                                                                left: '50%',
                                                                transform: 'translate(-50%,-50%)',
                                                                cursor: 'pointer',
                                                                zIndex: 1,
                                                            }}
                                                            onClick={() =>
                                                                FileSaver.saveAs(
                                                                    `${host}${fileData}`,
                                                                    `image.${path.extname(
                                                                        fileData
                                                                    )}`
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="position-absolute start-0 top-0 end-0 bottom-0 download__btn">
                                                        <ZoomInIcon
                                                            className="bg-white rounded-circle position-absolute"
                                                            style={{
                                                                top: 0,
                                                                right: 0,
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => {
                                                                setShow(true);
                                                                setChatImage(fileData);
                                                            }}
                                                        />
                                                    </div>
                                                </Card>
                                            </Col>
                                        );
                                    }

                                    if (
                                        path.extname(fileData) === '.mp4' ||
                                        path.extname(fileData) === '.mov' ||
                                        path.extname(fileData) === '.wmv' ||
                                        path.extname(fileData) === '.flv' ||
                                        path.extname(fileData) === '.webm' ||
                                        path.extname(fileData) === '.mkv'
                                    ) {
                                        return (
                                            <Col xs={12} className="g-2" key={fileData}>
                                                <Card
                                                    elevation={5}
                                                    className="mb-0 img__card"
                                                    style={{
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        height: 400,
                                                        width: 400,
                                                    }}
                                                >
                                                    <video controls width="100%" height="400">
                                                        <source
                                                            src={fileData}
                                                            type={`video/${
                                                                path.extname(fileData).split('.')[1]
                                                            }`}
                                                        />
                                                    </video>
                                                </Card>
                                            </Col>
                                        );
                                    }
                                    if (
                                        path.extname(fileData) === '.mp3' ||
                                        path.extname(fileData) === '.ogg' ||
                                        path.extname(fileData) === '.mpeg'
                                    ) {
                                        return (
                                            <Col xs={12} className="g-2" key={fileData}>
                                                <audio controls>
                                                    <source
                                                        src={fileData}
                                                        type={`audio/${
                                                            path.extname(fileData).split('.')[1]
                                                        }`}
                                                    />
                                                </audio>
                                            </Col>
                                        );
                                    }
                                    return (
                                        <Col xs={12} className="g-2" key={fileData}>
                                            <Card
                                                elevation={5}
                                                className="mb-0 py-1 px-2 rounded"
                                                style={{
                                                    backgroundColor: '#616161',
                                                }}
                                            >
                                                <div
                                                    className="d-flex justify-content-between align-items-center"
                                                    style={{ width: 200 }}
                                                >
                                                    <InsertDriveFileIcon className="text-white" />
                                                    <span className="col-4 text-truncate text-white">
                                                        {fileData.split('/')[2]}
                                                    </span>
                                                    <span className="text-white">
                                                        {path.extname(fileData)}
                                                    </span>
                                                    <IconButton>
                                                        <GetAppIcon
                                                            className="text-white"
                                                            onClick={() =>
                                                                FileSaver.saveAs(
                                                                    `${host}${fileData}`,
                                                                    `file.${path.extname(fileData)}`
                                                                )
                                                            }
                                                        />
                                                    </IconButton>
                                                </div>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )}
                    </div>

                    <Avatar alt={user.name} src={user.photo} />
                </div>
                <p className="text-white me-5 mt-1 pe-3 last__seen">
                    {moment(messageDetails.sendAt).fromNow()}
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

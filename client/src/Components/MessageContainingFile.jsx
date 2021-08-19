/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/media-has-caption */
import { Card, IconButton } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import path from 'path';
import { Col } from 'react-bootstrap';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileSaver from 'file-saver';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { host } from '../Config.json';

const MessageContainingFile = ({ fileData, setShow, setChatImage, fileLength }) => {
    if (
        path.extname(fileData) === '.png' ||
        path.extname(fileData) === '.jpg' ||
        path.extname(fileData) === '.jpeg' ||
        path.extname(fileData) === '.gif'
    ) {
        return (
            <Col
                xs={12}
                md={fileLength === 1 ? 12 : fileLength === 2 ? 6 : 4}
                className="g-2"
                key={fileData}
            >
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
                        width="auto"
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
                            type={`video/${path.extname(fileData).split('.')[1]}`}
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
                    <source src={fileData} type={`audio/${path.extname(fileData).split('.')[1]}`} />
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
                    <span className="col-4 text-truncate text-white">{fileData.split('/')[2]}</span>
                    <span className="text-white">{path.extname(fileData)}</span>
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
};

export default MessageContainingFile;

/* eslint-disable jsx-a11y/media-has-caption */
import { Card } from '@material-ui/core';
import { Col } from 'react-bootstrap';
import path from 'path';
import CancelIcon from '@material-ui/icons/Cancel';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { useRef } from 'react';

const UploadPreview = ({ fileData, removeFile }) => {
    const cardHeight = useRef(0);

    if (
        path.extname(fileData) === '.png' ||
        path.extname(fileData) === '.jpg' ||
        path.extname(fileData) === '.jpeg' ||
        path.extname(fileData) === '.gif'
    ) {
        return (
            <Col xs={12} md={6} className="g-2" key={fileData}>
                <Card
                    elevation={5}
                    className="mb-0 img__card"
                    style={{
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
                    <CancelIcon
                        className="position-absolute"
                        style={{
                            right: 0,
                            top: 0,
                            cursor: 'pointer',
                        }}
                        onClick={() => removeFile(fileData)}
                    />
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
                        position: 'relative',
                    }}
                >
                    <video controls width="100%" height="400">
                        <source
                            src={fileData}
                            type={`video/${path.extname(fileData).split('.')[1]}`}
                        />
                    </video>
                    <CancelIcon
                        className="position-absolute"
                        style={{
                            right: 0,
                            top: 0,
                            cursor: 'pointer',
                            zIndex: 1,
                        }}
                        onClick={() => removeFile(fileData)}
                    />
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
                <div className="position-relative">
                    <audio controls>
                        <source
                            src={fileData}
                            type={`audio/${path.extname(fileData).split('.')[1]}`}
                        />
                    </audio>
                    <CancelIcon
                        className="position-absolute"
                        style={{
                            right: 0,
                            top: 0,
                            cursor: 'pointer',
                        }}
                        onClick={() => removeFile(fileData)}
                    />
                </div>
            </Col>
        );
    }
    console.log(cardHeight.current.offsetHeight);
    return (
        <Col xs={12} md={6} className="g-2" key={fileData}>
            <Card
                elevation={5}
                className="mb-0 py-3 px-3 rounded position-relative"
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
                    <CancelIcon
                        className="position-absolute"
                        style={{
                            right: 0,
                            top: 0,
                            cursor: 'pointer',
                        }}
                        onClick={() => removeFile(fileData)}
                    />
                </div>
            </Card>
        </Col>
    );
};

export default UploadPreview;

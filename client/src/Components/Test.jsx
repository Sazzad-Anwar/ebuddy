/* eslint-disable no-unused-vars */
import { useState } from 'react';

const Test = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    console.log('hello');

    const handleFiles = (files) => {
        setSelectedFiles(files);
        console.log(files);
    };
    const dragOver = (e) => {
        e.preventDefault();
    };

    const dragEnter = (e) => {
        e.preventDefault();
    };

    const dragLeave = (e) => {
        e.preventDefault();
    };

    const fileDrop = (e) => {
        e.preventDefault();
        const { files } = e.dataTransfer;
        if (files.length) {
            handleFiles(files);
        }
    };

    return (
        <div>
            <div
                className="drop-container d-flex justify-content-center align-items-center"
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
                style={{
                    height: 300,
                    width: 300,
                    border: '1px solid black',
                }}
            >
                <div className="drop-message">
                    <div className="upload-icon" />
                    Drag and Drop files here or click to upload
                </div>
            </div>
            <div className="files">
                {/* {selectedFiles.map((data) => (
                    <div className="file-status-bar" key={data.name}>
                        <div>
                            <div className="file-type-logo" />
                            <div className="file-type">{data.name}</div>
                            <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>
                                {data.name}
                            </span>
                            <span className="file-size">({data.size})</span>{' '}
                        </div>
                        <div className="file-remove">X</div>
                    </div>
                ))} */}
            </div>
        </div>
    );
};

export default Test;

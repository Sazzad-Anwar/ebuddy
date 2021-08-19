import { useState } from 'react';

const DragNDrop = () => {
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
        console.log(files);
        if (files.length) {
            handleFiles(files);
        }
    };

    return (
        <div>
            <div
                className="drop-container"
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
            >
                <div className="drop-message">
                    <div className="upload-icon" />
                    Drag and Drop files here or click to upload
                </div>
            </div>
            <div className="files">
                {selectedFiles.map((data) => (
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
                ))}
            </div>
        </div>
    );
};

export default DragNDrop;

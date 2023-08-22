const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/file', (req, res) => {
    // Set the appropriate headers for the file
    res.setHeader('Content-Disposition', 'attachment; filename="example.txt"');
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile('path/to/your/file');
});

app.get('/list', (req, res) => {
    const folderPath = path.resolve(__dirname, req.query.path);
    const files = fs.readdirSync(folderPath);
    const contents = [{
        name: '/..',
        directory: true,
        size: 0,
        fullPath: path.resolve(folderPath, '..')
    }];
    for (const file of files) {
        const fullPath = path.resolve(folderPath, file);
        try {
            const stat = fs.statSync(fullPath);
            contents.push({
                name: file,
                directory: stat.isDirectory(),
                size: stat.size,
                fullPath
            });
        } catch(e) {
            console.log('Error', e);
        }
    }
    res.json({
        path: folderPath,
        contents: contents,
    });
});

// Define the path to the video file
// const videoPath = 'path/to/your/video.mp4';

// Define the video streaming endpoint
app.get('/video', (req, res) => {
    // Get the file stats (e.g., file size)
    const videoPath = req.query.path;

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    // Parse the range header to get the start and end points
    const range = req.headers.range;
    if (range) {
        // Parse the range header value
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        // Create the stream using range information
        const stream = fs.createReadStream(videoPath, { start, end });

        // Set the necessary headers for video streaming
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        });
        // Pipe the video stream to the response
        stream.pipe(res);
    } else {
        // If the range header is not present, send the entire video
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        });
        fs.createReadStream(videoPath).pipe(res);
    }
});

// Start the server
const port = 3000; // You can change the port number if needed
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
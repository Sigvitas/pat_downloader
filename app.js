const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const axios = require('axios');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Create the 'responses' directory if it doesn't exist
const responsesDirectory = path.join(__dirname, 'responses');
if (!fs.existsSync(responsesDirectory)) {
    fs.mkdirSync(responsesDirectory, { recursive: true });
}

const baseUrl = 'https://patentcenter.uspto.gov/retrieval/public/v2/application/data';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/fetch-patent-data', async (req, res) => {
    try {
        console.log('POST request to /fetch-patent-data received.');

        const { applicationNumber } = req.body;
        console.log('Application Number:', applicationNumber);

        // Construct the file path based on the application number
        const filePath = path.join(__dirname, 'responses', `${applicationNumber}.json`);
        console.log('File Path:', filePath);

        // Make an API request
        const apiUrl = `${baseUrl}?applicationNumberText=${applicationNumber}`;
        const response = await axios.get(apiUrl);
        const responseData = response.data;

        // Store the response data in a local file
        fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));

        // Extract the relevant information as before
        const applicationMetaData = responseData.applicationMetaData || {};
        const title = applicationMetaData.inventionTitle || 'N/A';
        const number = (applicationMetaData.applicationIdentification || {}).applicationNumberText?.trim() || 'N/A';
        const assignee = (responseData.correspondenceAddress || {}).nameLineOneText || 'N/A';
        const inventor = (responseData.inventorBag?.[0] || {}).nameLineOneText || 'N/A';
        const priorityDate = applicationMetaData.effectiveFilingDate || 'N/A';
        const filedDate = applicationMetaData.filingDate || 'N/A';
        const publishedDate = applicationMetaData.grantDate || 'N/A';

        // Send the extracted information to the client-side
        res.json({
            title,
            number,
            assignee,
            inventor,
            priorityDate,
            filedDate,
            publishedDate
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// app.post('/fetch-patent-data', async (req, res) => {
//     try {
//         const { applicationNumber } = req.body;

//         // Construct the file path based on the application number
//         const filePath = path.join(__dirname, 'responses', `${applicationNumber}.json`);

//         // Check if the file exists
//         if (fs.existsSync(filePath)) {
//             // Read the content of the file
//             const fileContent = fs.readFileSync(filePath, 'utf8');
//             const responseData = JSON.parse(fileContent);

//             // Extract the relevant information as before
//             const applicationMetaData = responseData.applicationMetaData || {};
//             const title = applicationMetaData.inventionTitle || 'N/A';
//             const number = (applicationMetaData.applicationIdentification || {}).applicationNumberText?.trim() || 'N/A';
//             const assignee = (responseData.correspondenceAddress || {}).nameLineOneText || 'N/A';
//             const inventor = (responseData.inventorBag?.[0] || {}).nameLineOneText || 'N/A';
//             const priorityDate = applicationMetaData.effectiveFilingDate || 'N/A';
//             const filedDate = applicationMetaData.filingDate || 'N/A';
//             const publishedDate = applicationMetaData.grantDate || 'N/A';

//             // Send the extracted information to the client-side
//             res.json({
//                 title,
//                 number,
//                 assignee,
//                 inventor,
//                 priorityDate,
//                 filedDate,
//                 publishedDate
//             });
//         } else {
//             // If the file does not exist, return an error response
//             res.status(404).json({ error: 'Data not found' });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });



// app.post('/fetch-patent-data', async (req, res) => {
//     try {
//         const { applicationNumber } = req.body;
//         const filePath = path.join(__dirname, 'responses', `${applicationNumber}.json`);

//         let responseData;

//         if (fs.existsSync(filePath)) {
//             // If the file exists, read the data from the file
//             const fileData = fs.readFileSync(filePath, 'utf-8');
//             responseData = JSON.parse(fileData);
//         } else {
//             // If the file doesn't exist, make an API request
//             const apiUrl = `${baseUrl}?applicationNumberText=${applicationNumber}`;
//             const response = await axios.get(apiUrl);
//             responseData = response.data;

//             // Store the response data in a local file
//             fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));
//         }

//         // Extract the "applicationNumberText" from the response
//         const applicationNumberText = responseData.applicationMetaData.applicationIdentification.applicationNumberText.trim();

//         // Pass the application number to the client-side
//         res.json({ applicationNumberText });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const axios = require('axios');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


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

        const filePath = path.join(__dirname, 'responses', `${applicationNumber}.json`);
        console.log('File Path:', filePath);

        const apiUrl = `${baseUrl}?applicationNumberText=${applicationNumber}`;
        const response = await axios.get(apiUrl);
        const responseData = response.data;

        fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));

        const applicationMetaData = responseData.applicationMetaData || {};
        const title = applicationMetaData.inventionTitle || 'N/A';
        const number = (applicationMetaData.applicationIdentification || {}).applicationNumberText?.trim() || 'N/A';
        const assignee = (responseData.correspondenceAddress || {}).nameLineOneText || 'N/A';
        const inventor = (responseData.inventorBag?.[0] || {}).nameLineOneText || 'N/A';
        const priorityDate = applicationMetaData.effectiveFilingDate || 'N/A';
        const filedDate = applicationMetaData.filingDate || 'N/A';
        const publishedDate = applicationMetaData.grantDate || 'N/A';

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

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

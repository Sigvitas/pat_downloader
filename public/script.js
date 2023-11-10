async function searchPatent() {
    const searchInput = document.getElementById('searchInput').value;

    try {
        // Make an AJAX request to the server
        const response = await fetch('/fetch-patent-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applicationNumber: searchInput,
            }),
        });

        if (response.ok) {
            const responseData = await response.json();

            // Function to format dates in MM/DD/YYYY format
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US');
            };

            // Update HTML elements with extracted information
            document.getElementById('titlename').innerText = `Title: ${responseData.title}`;
            document.getElementById('number').innerText = `Number: ${responseData.number}`;
            document.getElementById('assignee').innerText = `Assignee: ${responseData.assignee}`;
            document.getElementById('inventors').innerText = `Inventors: ${responseData.inventor}`;
            document.getElementById('priorityDate').innerText = `Priority Date: ${formatDate(responseData.priorityDate)}`;
            document.getElementById('filedDate').innerText = `Filed Date: ${formatDate(responseData.filedDate)}`;
            document.getElementById('publishedDate').innerText = `Published Date: ${formatDate(responseData.publishedDate)}`;

           // Function to create the 'Go' button dynamically
function createGoButton() {
    const goButton = document.createElement('button');
    goButton.innerText = 'Go';
    goButton.id = 'goButton';

    // Style the button
    goButton.style.display = 'block';
    goButton.style.margin = 'auto';

    // Add an event listener to the 'Go' button
    goButton.addEventListener('click', async () => {
        // Add your logic for the 'Go' button click event
        console.log('Go button clicked!');

        // Create checkboxes dynamically
        const asFiledCheckbox = createCheckbox('As Filed');
        const asIssuedCheckbox = createCheckbox('As Issued');
        const asPublishedCheckbox = createCheckbox('As Published');

        // Create a container div for the checkboxes in the same row
        const checkboxesRow = document.createElement('div');
        checkboxesRow.style.display = 'flex'; // Make the container a flex container
        checkboxesRow.style.justifyContent = 'center'; // Center the content horizontally
        checkboxesRow.style.gap = '30px'; // Add space between checkboxes
        checkboxesRow.style.fontSize = '19px';
        checkboxesRow.style.marginTop = '10px';

        // Append checkboxes to the container
        checkboxesRow.appendChild(asFiledCheckbox);
        checkboxesRow.appendChild(asIssuedCheckbox);
        checkboxesRow.appendChild(asPublishedCheckbox);

        // Append the container to the document
        document.body.appendChild(checkboxesRow);
    });

    // Append the 'Go' button to the document
    document.body.appendChild(goButton);
}

// Function to create sub-checkboxes based on the selected category
function createSubCheckboxes(category) {
    // Create a container div for sub-checkboxes
    const subCheckboxContainer = document.createElement('div');
    subCheckboxContainer.style.display = 'flex';
    subCheckboxContainer.style.flexDirection = 'column'; // Display in vertical columns
    subCheckboxContainer.style.alignItems = 'center'; // Center the content horizontally
    subCheckboxContainer.style.marginTop = '10px';

    // Array of sub-checkbox labels
    const subCheckboxLabels = ['All', 'Abstract', 'Claims', 'Specification', 'Drawings'];

    // Create sub-checkboxes
    subCheckboxLabels.forEach(label => {
        const subCheckbox = createCheckbox(label);
        subCheckboxContainer.appendChild(subCheckbox);
    });

    // Append the sub-checkbox container to the document
    document.body.appendChild(subCheckboxContainer);
}

// Function to create a checkbox
function createCheckbox(labelText) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = labelText.toLowerCase().replace(/\s/g, ''); // Generate an ID based on the label
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.innerText = labelText;

    // Style the checkbox and label as needed
    checkbox.style.margin = '10px';
    label.style.marginRight = '20px';

    // Add an event listener to the checkbox
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            createSubCheckboxes(labelText);
        }
    });

    // Create a container div to hold the checkbox and label
    const container = document.createElement('div');
    container.appendChild(checkbox);
    container.appendChild(label);

    return container;
}

// Call the function to create the 'Go' button
createGoButton();








        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

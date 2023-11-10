async function searchPatent() {
    const searchInput = document.getElementById('searchInput').value;
    const loadingSpinner = document.getElementById('loadingSpinner');

    try {
        loadingSpinner.style.display = 'block';
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
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US');
            };

            document.getElementById('titlename').innerText = `Title: ${responseData.title}`;
            document.getElementById('number').innerText = `Number: ${responseData.number}`;
            document.getElementById('assignee').innerText = `Assignee: ${responseData.assignee}`;
            document.getElementById('inventors').innerText = `Inventors: ${responseData.inventor}`;
            document.getElementById('priorityDate').innerText = `Priority Date: ${formatDate(responseData.priorityDate)}`;
            document.getElementById('filedDate').innerText = `Filed Date: ${formatDate(responseData.filedDate)}`;
            document.getElementById('publishedDate').innerText = `Published Date: ${formatDate(responseData.publishedDate)}`;
function createGoButton() {
    const goButton = document.createElement('button');
    goButton.innerText = 'Go';
    goButton.id = 'goButton';

    goButton.style.display = 'block';
    goButton.style.margin = 'auto';

    // Add an event listener to the 'Go' button
    goButton.addEventListener('click', async () => {
        console.log('Go button clicked!');

 
        const asFiledCheckbox = createCheckbox('As Filed');
        const asIssuedCheckbox = createCheckbox('As Issued');
        const asPublishedCheckbox = createCheckbox('As Published');


        const checkboxesRow = document.createElement('div');
        checkboxesRow.style.display = 'flex'; 
        checkboxesRow.style.justifyContent = 'center';
        checkboxesRow.style.gap = '30px'; 
        checkboxesRow.style.fontSize = '19px';
        checkboxesRow.style.marginTop = '10px';


        checkboxesRow.appendChild(asFiledCheckbox);
        checkboxesRow.appendChild(asIssuedCheckbox);
        checkboxesRow.appendChild(asPublishedCheckbox);
        document.body.appendChild(checkboxesRow);
    });


    document.body.appendChild(goButton);
}

function createSubCheckboxes(category) {

    const subCheckboxContainer = document.createElement('div');
    subCheckboxContainer.style.display = 'flex';
    subCheckboxContainer.style.flexDirection = 'column'; 
    subCheckboxContainer.style.alignItems = 'center'; 
    subCheckboxContainer.style.marginTop = '10px';

    const subCheckboxLabels = ['All', 'Abstract', 'Claims', 'Specification', 'Drawings'];

    subCheckboxLabels.forEach(label => {
        const subCheckbox = createCheckbox(label);
        subCheckboxContainer.appendChild(subCheckbox);
    });

    document.body.appendChild(subCheckboxContainer);
}

function createCheckbox(labelText) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = labelText.toLowerCase().replace(/\s/g, ''); 
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.innerText = labelText;

    checkbox.style.margin = '10px';
    label.style.marginRight = '20px';

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            createSubCheckboxes(labelText);
        }
    });

    const container = document.createElement('div');
    container.appendChild(checkbox);
    container.appendChild(label);

    return container;
}

createGoButton();

        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
    finally {
        loadingSpinner.style.display = 'none';
    }
}

# Camunda Activity Tracker with Variable Viewer

This project is a web application that visualizes process instances and activities from a Camunda BPM engine. It allows users to view the process flow, highlight activities, and inspect associated variables at each activity step.

## Features

### BPMN Diagram Viewer:
- Visualizes the process flow using BPMN.js.
- Highlights activities in the diagram.

### Activity Tracker:
- Lists all activities executed in a process instance.
- Displays variables associated with each activity.

### Dynamic Data:
- Fetches data from Camunda's historical tables (`ACT_HI_PROCINST`, `ACT_HI_ACTINST`, `ACT_HI_DETAIL`) to display process-specific information.

## Technologies Used

### Backend
- Node.js with Express.js
- Sequelize for ORM
- PostgreSQL as the database
- Camunda BPM for process orchestration

### Frontend
- HTML, CSS, JavaScript
- BPMN.js for rendering BPMN diagrams

## Prerequisites
- Camunda BPM installed and running.
- Node.js and npm installed.
- PostgreSQL database containing Camunda's tables (`ACT_HI_PROCINST`, `ACT_HI_ACTINST`, `ACT_HI_DETAIL`).

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-repository/camunda-activity-tracker.git
cd camunda-activity-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your database credentials:

```makefile
DB_HOST=localhost
DB_NAME=camunda
DB_USER=camunda
DB_PASS=your_password
DB_PORT=5432
```

### 4. Run the Application
```bash
npm start
```

The application will run at `http://localhost:3000`.

## Endpoints

### API Endpoints

| Method | Endpoint                              | Description                                      |
|--------|---------------------------------------|-------------------------------------------------
| GET    | `/api/process-instance/:id/activities` | Fetches activities and variables for a process instance. |

### Response Example
```json
{
  "processInstance": {
    "id": "123456789",
    "businessKey": "my-business-key",
    "startTime": "2024-11-15T10:00:00.000Z",
    "endTime": "2024-11-15T11:00:00.000Z"
  },
  "activities": [
    {
      "id": "activity1",
      "name": "Start Event",
      "type": "startEvent",
      "startTime": "2024-11-15T10:00:00.000Z",
      "endTime": "2024-11-15T10:05:00.000Z",
      "variables": [
        { "name": "var1", "value": "value1" },
        { "name": "var2", "value": "value2" }
      ]
    }
  ],
  "bpmnXml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>..."
}
```

## Usage

### Frontend Workflow
1. Select a process instance using the dropdown.
2. View the BPMN diagram with highlighted activities.
3. Click on an activity to view its variables in a modal.

### Backend Workflow
1. Fetch activities for a process instance from `ACT_HI_ACTINST`.
2. Fetch variable changes from `ACT_HI_DETAIL`.
3. Merge variable updates to show a snapshot of all variables at each activity.

## Database Schema

### Key Tables Used

#### `ACT_HI_PROCINST`
Stores process instance details.

| Column Name  | Description               |
|--------------|---------------------------|
| PROC_INST_ID_ | Process Instance ID       |
| START_TIME_   | Process start time        |
| END_TIME_     | Process end time          |

#### `ACT_HI_ACTINST`
Stores historical activity instance data.

| Column Name  | Description               |
|--------------|---------------------------|
| ACT_ID_       | Activity ID               |
| ACT_NAME_     | Activity Name             |
| PROC_INST_ID_ | Associated Process Instance ID |

#### `ACT_HI_DETAIL`
Stores detailed variable updates.

| Column Name  | Description               |
|--------------|---------------------------|
| VAR_NAME_     | Variable Name             |
| TEXT_         | Variable Value (Text format) |
| ACT_INST_ID_  | Associated Activity Instance ID |

## Customization

### Add New Features:
- Extend the API to include task-level details.
- Add filters to the frontend for searching variables or activities.

### Integrate Camunda REST API:
- Replace direct database queries with Camunda’s REST API for environments where database access is restricted.

## Troubleshooting

### Common Issues

#### Database Connection Error:
- Ensure the database credentials in `.env` are correct.
- Verify the database is running and accessible.

#### BPMN.js Error: "No diagram to display":
- Ensure the BPMN XML is valid.
- Verify the `bpmnXml` field in the API response contains valid XML.

#### Variables Missing for Activities:
- Check the `ACT_HI_DETAIL` table for entries with `VAR_TYPE_` not null.
- Ensure variables are being logged in Camunda during process execution.

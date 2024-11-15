const express = require("express");
const path = require("path");
const fs = require("fs");
const {
  sequelize,
  ProcessInstance,
  ActivityInstance,
  VariableInstance,
} = require("./database");

const app = express();
const PORT = 5000;

function parseVariableValue(variable) {
  return (
    variable.variableValue ||
    variable.variableDoubleValue ||
    variable.variableLongValue
  );
}

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Home Route
app.get("/", async (req, res) => {
  // Fetch all process instances from the database
  const instances = await ProcessInstance.findAll({
    order: [[sequelize.col("start_time_"), "DESC"]],
  });

  res.render("index", { instances });
});

app.get("/api/process-instance/:id/activities", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch process instance details
    const processInstance = await ProcessInstance.findOne({
      where: { processInstanceId: id },
    });

    console.log("PROCESSS INSTANC", JSON.stringify(processInstance, null, 4));

    if (!processInstance) {
      return res.status(404).json({ error: "Process instance not found" });
    }

    // Fetch activity instances for the process instance
    const activities = await ActivityInstance.findAll({
      where: { processInstanceId: id },
      order: [["startTime", "ASC"]],
    });

    let variableDetails = await VariableInstance.findAll({
      where: { processInstanceId: id },
      order: [["createTime", "ASC"]],
    });

    const variableSnapshot = {};

    variableDetails = variableDetails.filter((variable) => {
      if (variable.activityInstanceId === id) {
        variableSnapshot[variable.name] = parseVariableValue(variable);
        
        return false;
      }

      return true;
    });

    // Map variables to their respective activity instances
    const activityData = activities.map((activity) => {
      // Check if there are variable updates for this activity
      variableDetails = variableDetails.filter((variable) => {
        if (variable.activityInstanceId === activity.id) {
          variableSnapshot[variable.name] = parseVariableValue(variable);

          return false;
        }

        return true;
      });

      return {
        id: activity.activityId,
        name: activity.activityName,
        type: activity.activityType,
        startTime: activity.startTime,
        endTime: activity.endTime,
        variables: JSON.parse(JSON.stringify(variableSnapshot)),
      };
    });

    // console.log('ACTIVITIES', JSON.stringify(activities, null, 4));

    const BPMN_DIRECTORY = path.join(__dirname, "../public/diagrams");

    const bpmnFilePath = path.join(BPMN_DIRECTORY, `example.bpmn`);

    if (!fs.existsSync(bpmnFilePath)) {
      return res.status(404).json({ error: "BPMN XML file not found" });
    }

    const bpmnXml = fs.readFileSync(bpmnFilePath, "utf-8");

    // Combine response
    const response = {
      processInstance: {
        id: processInstance.processInstanceId,
        businessKey: processInstance.businessKey,
        startTime: processInstance.startTime,
        endTime: processInstance.endTime,
      },
      activities: activityData,
      bpmnXml: bpmnXml,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching process instance activities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server and sync database
app.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server is running on http://localhost:${PORT}`);
});

import React from "react";
import Card from "../../Card/Card";

const TaskListCard: React.FC = () => {
  return (
    <Card>
      <h3 style={{ margin: "0 0 16px 0", color: "#1F2937" }}>Task List</h3>
      <ul style={{ margin: "0", paddingLeft: "20px", color: "#6B7280" }}>
        <li>Create component examples</li>
        <li>Add more components</li>
        <li>Style the examples page</li>
        <li>Test all components</li>
      </ul>
    </Card>
  );
};

export default TaskListCard;

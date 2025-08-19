import React from "react";
import ExampleContainer from "../ExampleContainer";
import BasicCard from "./BasicCard";
import ContactFormCard from "./ContactFormCard";
import TaskListCard from "./TaskListCard";
import WideCard from "./WideCard";
import UserProfileCard from "./UserProfileCard";
import ActionCard from "./ActionCard";

const CardExamples: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        padding: "16px 0",
      }}
    >
      <ExampleContainer
        title="Basic Card"
        description="Simple card with basic content"
        size="medium"
      >
        <BasicCard />
      </ExampleContainer>

      <ExampleContainer
        title="Contact Form"
        description="Card containing a form with inputs"
        size="medium"
      >
        <ContactFormCard />
      </ExampleContainer>

      <ExampleContainer
        title="Task List"
        description="Card with unordered list content"
        size="small"
      >
        <TaskListCard />
      </ExampleContainer>

      <ExampleContainer
        title="Wide Card"
        description="Card with custom max-width (600px)"
        size="large"
      >
        <WideCard />
      </ExampleContainer>

      <ExampleContainer
        title="User Profile"
        description="Complex layout with avatar and user info"
        size="medium"
      >
        <UserProfileCard />
      </ExampleContainer>

      <ExampleContainer
        title="Action Card"
        description="Card with interactive buttons"
        size="medium"
      >
        <ActionCard />
      </ExampleContainer>
    </div>
  );
};

export default CardExamples;

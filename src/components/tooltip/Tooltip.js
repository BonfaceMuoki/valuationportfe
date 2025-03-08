import React from "react";
import Icon from "../icon/Icon";
import { UncontrolledTooltip } from "reactstrap";

const TooltipComponent = ({
  iconClass = "",
  icon = "help-fill",  // Default icon name
  id,
  direction = "top",   // Default direction
  text = "",           // Default text
  containerClassName = "",
  tag: Tag,
  ...props
}) => {
  return (
    <>
      {Tag ? (
        <Tag className={containerClassName} id={id}>
          <Icon className={iconClass} name={icon} />
        </Tag>
      ) : (
        <Icon className={iconClass} name={icon} id={id} />
      )}


    </>
  );
};

export default TooltipComponent;

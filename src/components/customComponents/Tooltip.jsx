import React from "react";
import { Tooltip } from "react-tooltip";

export default function TooltipComp({ children, ...props }) {
  const { content = '' } = props
  return (
    <>
      <div
        data-tooltip-id="tooltip"
        data-tooltip-content={content ? content : ''}
        data-tooltip-place="bottom"
      >
        {children}
      </div>
      <Tooltip
        id="tooltip"
        // style={{ display: 'flex', height: '100%' }}
        style={{ wordWrap: true }}
      />
    </>
  )
}
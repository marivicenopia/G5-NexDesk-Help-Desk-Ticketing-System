import React from 'react'
import "./typography.css"

export enum Size {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}

interface TypographyInterface {
    label: string;
    style?: React.CSSProperties;    
    size? : Size;
}

export const Typography = ({ 
    style,
    label,
    size
}: TypographyInterface) => {
  return (
    <label className = {'typography-style '+ size} style={style}>
      {label}
    </label>
  )
}


import React from 'react'

interface ButtonInterface {
    label: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const Buttons = ({
    style,
    label,
    onClick 
}: ButtonInterface) => {
  return (
    <button className = {'button-style '} 
        style={style} onClick = {onClick}>
        {label}       
    </button>
  )
}

// export const Typography = ({ 
//     style,
//     label,
//     size
// }: TypographyInterface) => {
//   return (
//     <label className = {'typography-style '+ size} style={style}>
//       {label}
//     </label>
//   )
// }
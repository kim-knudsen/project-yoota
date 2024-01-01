import { DetailedHTMLProps, FunctionComponent, HTMLAttributes, ReactNode } from 'react'

interface PProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
    children: ReactNode
}

const P: FunctionComponent<PProps> = ({ children, ...props }) => <p {...props}>{children}</p>

interface H2Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
    children: ReactNode
}
const H2: FunctionComponent<H2Props> = ({ children, ...props }) => <h2 {...props}>{children}</h2>

const TWText = {
    H2,
    P
}

export default TWText

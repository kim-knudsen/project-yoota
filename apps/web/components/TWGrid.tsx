import { FunctionComponent, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

const Container: FunctionComponent<Props> = ({ children }) => (
    <div className="flex flex-wrap justify-center flex-col content-center items-center">{children}</div>
)

const TWGrid = {
    Container
}

export default TWGrid

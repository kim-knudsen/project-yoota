import { FunctionComponent, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

const TWPage: FunctionComponent<Props> = ({ children }) => (
    <main className="w-screen h-screen box-border flex justify-center">{children}</main>
)

export default TWPage

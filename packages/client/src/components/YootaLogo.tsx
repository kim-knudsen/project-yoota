import { ColorScheme } from '@yoota/theme'
import { FunctionComponent } from 'react'
import { YootaLogoSvg } from '../svg'

const RATIO = 437 / 1000

type LogoColor = 'blue' | 'white' | 'grey'
type LogoSize = 46 | 68 | 112

interface Props {
    color: LogoColor
    size?: LogoSize
}

export const YootaLogo: FunctionComponent<Props> = ({ color, size = 68 }) => (
    <YootaLogoSvg width={size} height={size * RATIO} fill={getFillColor(color)} />
)

const getFillColor = (logoColor: LogoColor) => {
    switch (logoColor) {
        case 'blue':
            return ColorScheme.blue.normal
        case 'white':
            return ColorScheme.white.normal
        case 'grey':
            return ColorScheme.grey.shade03
    }
}

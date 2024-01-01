const unit = 6

export const units = {
    unit01: unit * 1,
    unit02: unit * 2,
    unit03: unit * 3,
    unit04: unit * 4,
    unit05: unit * 5,
    unit06: unit * 6,
    unit07: unit * 7,
    unit08: unit * 8,
    unit09: unit * 9,
    unit10: unit * 10
}

export type GridSize = 'xs' | 'small' | 'medium' | 'large' | 'xl'

type GridUnits = {
    [index in GridSize]: number
}

export const grid: GridUnits = {
    xs: unit * 1,
    small: unit * 2,
    medium: unit * 4,
    large: unit * 6,
    xl: unit * 9
}

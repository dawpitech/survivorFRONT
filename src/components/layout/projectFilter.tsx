import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {ProjectDetail} from "@/lib/projects";

type Sectors = (string | undefined)[];
type Maturities = (string | undefined)[];

function getSectors(projects: ProjectDetail[]) {
    const allSectors = projects.map((proj) => proj.sector);
    const uniqueSectors = [...new Set(allSectors)];
    uniqueSectors.push("All")
    return uniqueSectors;
}

function getMaturity(projects: ProjectDetail[]) {
    const allMaturities = projects.map((proj) => proj.maturity);
    const uniqueMaturity = [...new Set(allMaturities)];
    uniqueMaturity.push("All")
    return uniqueMaturity;
}

export function SimpleListMaturity({projects, onSectorChange}: {
    projects: ProjectDetail[],
    onSectorChange: (sector: string | null) => void
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const open = Boolean(anchorEl);

    const maturities: Maturities = getMaturity(projects);

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        onSectorChange(maturities[index] ?? null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="flex justify-center items-center">
            <List
                component="nav"
                aria-label="Device settings"
            >
                <ListItemButton
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                    className="text-center justify-center"
                    sx={{
                        '&:hover, &:focus, &:active, &.Mui-focusVisible': {
                            backgroundColor: 'transparent !important',
                        },
                        '&::before': {
                            display: 'none !important',
                        },
                        '&::after': {
                            display: 'none !important',
                        },
                        '& .MuiTouchRipple-root': {
                            display: 'none !important',
                        }
                    }}
                >
                    <ListItemText
                        primary="Maturities"
                        secondary={maturities[selectedIndex] || "All"}
                        className="text-center px-6 py-3 rounded-xl border border-gray-200 bg-white"
                    />
                </ListItemButton>
            </List>

            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'lock-button',
                        role: 'listbox',
                    },
                }}
            >
                {maturities.map((maturity, index) => (
                    <MenuItem
                        key={maturity}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {maturity}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export default function SimpleListSector({projects, onSectorChange}: {
    projects: ProjectDetail[],
    onSectorChange: (sector: string | null) => void
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const open = Boolean(anchorEl);

    const sectors: Sectors = getSectors(projects);

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        onSectorChange(sectors[index] ?? null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="flex justify-center items-center">
            <List
                component="nav"
                aria-label="Device settings"
            >
                <ListItemButton
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                    className="text-center justify-center"
                    sx={{
                        '&:hover, &:focus, &:active, &.Mui-focusVisible': {
                            backgroundColor: 'transparent !important',
                        },
                        '&::before': {
                            display: 'none !important',
                        },
                        '&::after': {
                            display: 'none !important',
                        },
                        '& .MuiTouchRipple-root': {
                            display: 'none !important',
                        }
                    }}
                >
                    <ListItemText
                        primary="Sectors"
                        secondary={sectors[selectedIndex] || "All"}
                        className="text-center px-6 py-3 rounded-xl border border-gray-200 bg-white"
                    />
                </ListItemButton>
            </List>

            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'lock-button',
                        role: 'listbox',
                    },
                }}
            >
                {sectors.map((sector, index) => (
                    <MenuItem
                        key={sector}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {sector}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

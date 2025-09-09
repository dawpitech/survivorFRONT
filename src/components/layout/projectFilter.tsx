import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {ProjectDetail} from "@/lib/projects";

type Sectors = (string | undefined)[];
type Maturities = (string | undefined)[];
type Location = (string | undefined)[];

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

function getLocation(projects: ProjectDetail[]) {
    const allLocation = projects.map((proj) => proj.address);
    const uniqueLocation = [...new Set(allLocation)];
    uniqueLocation.push("All")
    return uniqueLocation;
}

export function SimpleListLocation({projects, onSectorChange }: {
    projects: ProjectDetail[],
    onSectorChange: (sector: string | null) => void
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const open = Boolean(anchorEl);

    const location: Location = getLocation(projects);

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        onSectorChange(location[index] ?? null)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <List
                component="nav"
                aria-label="Device settings"
                sx={{bgcolor: 'background.paper'}}
            >
                <ListItemButton
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                >
                    <ListItemText
                        primary="Location"
                        secondary={location[selectedIndex] || "All"}
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
                {location.map((loc, index) => (
                    <MenuItem
                        key={loc}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {loc}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export function SimpleListMaturity({projects, onSectorChange }: {
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
        <div>
            <List
                component="nav"
                aria-label="Device settings"
                sx={{bgcolor: 'background.paper'}}
            >
                <ListItemButton
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                >
                    <ListItemText
                        primary="Secteur"
                        secondary={maturities[selectedIndex] || "All"}
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

export default function SimpleListSector({projects, onSectorChange }: {
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
        <div>
            <List
                component="nav"
                aria-label="Device settings"
                sx={{bgcolor: 'background.paper'}}
            >
                <ListItemButton
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                >
                    <ListItemText
                        primary="Sectors"
                        secondary={sectors[selectedIndex] || "All"}
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

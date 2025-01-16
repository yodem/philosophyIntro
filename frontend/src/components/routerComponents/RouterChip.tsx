import { Chip, ChipProps } from "@mui/material";
import { createLink, LinkComponent } from '@tanstack/react-router';
import { forwardRef } from "react";

interface MUILinkProps extends Omit<ChipProps, 'href'> {
    // Add any additional props you want to pass to the chip
}

const MUILinkComponent = forwardRef<HTMLAnchorElement, MUILinkProps>(
    (props, ref) => {
        return <Chip component={'a'} ref={ref} {...props} />
    },
)

const CreatedLinkComponent = createLink(MUILinkComponent)

export const RouterChip: LinkComponent<typeof MUILinkComponent> = (props) => {
    return <CreatedLinkComponent preload={'render'} {...props} />
}